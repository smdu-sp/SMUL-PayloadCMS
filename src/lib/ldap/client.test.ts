import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it, mock } from "node:test";
import { autenticarLdap, buscarUsuarioLdapPorLogin } from "./client.ts";
import { getLdapDevUser } from "./dev-user.ts";

const keys = ["NODE_ENV", "LDAP_AUTH_MODE", "LDAP_DEV_LOGIN", "LDAP_DEV_PASSWORD", "LDAP_API_URL"];
let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  Object.assign(process.env, {
    NODE_ENV: "development",
    LDAP_AUTH_MODE: "mock",
    LDAP_DEV_LOGIN: "dev.admin",
    LDAP_DEV_PASSWORD: "test-only-password",
  });
  delete process.env.LDAP_API_URL;
});

afterEach(() => {
  for (const key of keys) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  mock.restoreAll();
});

describe("LDAP development authentication", () => {
  it("authenticates only the configured credentials without any network calls", async () => {
    const fetch = mock.method(globalThis, "fetch", () => {
      throw new Error("Unexpected external request");
    });
    assert.equal(await autenticarLdap("dev.admin", "test-only-password"), true);
    assert.equal(await autenticarLdap("dev.admin", "wrong"), false);
    assert.equal(await autenticarLdap("other", "test-only-password"), false);
    assert.equal(await autenticarLdap("dev.admin", ""), false);
    assert.deepEqual(await buscarUsuarioLdapPorLogin("dev.admin"), {
      login: "dev.admin",
      email: "dev.admin@example.test",
      nome: "Administrador local de desenvolvimento",
    });
    assert.equal(await buscarUsuarioLdapPorLogin("other"), null);
    assert.equal(fetch.mock.callCount(), 0);
  });

  it("rejects mock outside development and never falls back to the API", async () => {
    const fetch = mock.method(globalThis, "fetch", () => {
      throw new Error("Unexpected external request");
    });
    for (const env of ["production", "test", undefined]) {
      if (env) Object.assign(process.env, { NODE_ENV: env });
      else Reflect.deleteProperty(process.env, "NODE_ENV");
      assert.throws(() => getLdapDevUser(), /somente em development/);
      await assert.rejects(autenticarLdap("dev.admin", "test-only-password"), /somente em development/);
      await assert.rejects(buscarUsuarioLdapPorLogin("dev.admin"), /somente em development/);
    }
    assert.equal(fetch.mock.callCount(), 0);
  });

  it("requires explicit credentials and rejects unknown modes", () => {
    assert.throws(() => getLdapDevUser({ NODE_ENV: "development", LDAP_AUTH_MODE: "mock" }), /Configure/);
    assert.throws(() => getLdapDevUser({ ...process.env, LDAP_DEV_PASSWORD: " " }), /Configure/);
    assert.throws(() => getLdapDevUser({ ...process.env, LDAP_AUTH_MODE: "typo" }), /external ou mock/);
  });

  it("uses the real client by default even when development credentials exist", async () => {
    delete process.env.LDAP_AUTH_MODE;
    process.env.LDAP_API_URL = "https://ldap.example.test/";
    const fetch = mock.method(globalThis, "fetch", async () => new Response(null, { status: 401 }));
    assert.equal(getLdapDevUser(), null);
    assert.equal(await autenticarLdap("dev.admin", "test-only-password"), false);
    assert.equal(fetch.mock.calls[0].arguments[0], "https://ldap.example.test/auth/ldap/autenticar");
    assert.equal(fetch.mock.calls[0].arguments[1]?.body, JSON.stringify({ login: "dev.admin", senha: "test-only-password" }));
  });

  it("keeps external profile lookup and errors when explicitly configured", async () => {
    process.env.LDAP_AUTH_MODE = "external";
    process.env.LDAP_API_URL = "https://ldap.example.test";
    const fetch = mock.method(globalThis, "fetch", async () => new Response(null, { status: 404 }));
    assert.equal(await buscarUsuarioLdapPorLogin("a/b"), null);
    assert.equal(fetch.mock.calls[0].arguments[0], "https://ldap.example.test/auth/ldap/buscar-por-login/a%2Fb");
    fetch.mock.mockImplementation(async () => new Response(null, { status: 503 }));
    await assert.rejects(autenticarLdap("dev.admin", "test-only-password"), /Falha ao autenticar/);
  });
});
