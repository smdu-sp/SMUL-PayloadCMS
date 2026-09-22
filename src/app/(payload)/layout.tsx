import type { ServerFunctionClient } from "payload";
import "@payloadcms/next/css";

import config from "@payload-config";
import {
  handleServerFunctions,
  RootLayout,
} from "@payloadcms/next/layouts";
import React from "react";
import { importMap } from "./admin/importMap.js";
import "./custom.scss";
import { AdminTheme } from "../../components/admin/AdminTheme";

export const metadata = {
  title: "Meu Imovel Regular Admin",
  description: "Payload Admin do Meu Imovel Regular",
};

type Args = {
  children: React.ReactNode;
};

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";

  return handleServerFunctions({
    ...args,
    config,
    importMap,
  });
};

const Layout = ({ children }: Args) => (
  <RootLayout
    config={config}
    htmlProps={{ lang: "pt-BR" }}
    importMap={importMap}
    serverFunction={serverFunction}
  >
    <AdminTheme />
    {children}
  </RootLayout>
);

export default Layout;
