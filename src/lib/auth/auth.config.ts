/** @format */

import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { jwtDecode } from 'jwt-decode';
import type { IUsuarioSession } from '@/types/usuario';

type TokenArmazenado = {
	access_token?: string;
	refresh_token?: string;
	usuario?: IUsuarioSession;
};

function decodificarUsuario(access_token: string): IUsuarioSession | null {
	try {
		return jwtDecode<IUsuarioSession>(access_token);
	} catch {
		return null;
	}
}

async function renovarTokens(refresh_token: string) {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}refresh`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ refresh_token }),
		});
		if (!response.ok) return null;
		const data = (await response.json()) as {
			access_token?: string;
			refresh_token?: string;
		};
		if (!data.access_token) return null;
		return {
			access_token: data.access_token,
			refresh_token: data.refresh_token ?? refresh_token,
		};
	} catch {
		return null;
	}
}

function obterTokenArmazenado(token: Record<string, unknown>): TokenArmazenado {
	return (token.user as TokenArmazenado | undefined) ?? {};
}

export default {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				login: { label: 'Login', type: 'text' },
				senha: { label: 'Senha', type: 'password' },
			},
			type: 'credentials',
			async authorize(credentials) {
				if (credentials?.login && credentials?.senha) {
					const { login, senha } = credentials;
					try {
						const response = await fetch(
							`${process.env.NEXT_PUBLIC_API_URL}login`,
							{
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ login, senha }),
							},
						);
						const usuario = await response.json();
						if (usuario && response.ok) return usuario;
					} catch {
						return null;
					}
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (trigger === 'update' && session?.usuario) {
				const armazenado = obterTokenArmazenado(token);
				if (armazenado.usuario) {
					armazenado.usuario.avatar = session.usuario.avatar;
					armazenado.usuario.permissao = session.usuario.permissao;
					armazenado.usuario.nomeSocial = session.usuario.nomeSocial;
					token.user = armazenado;
				}
				return token;
			}

			if (user) {
				token.user = user;
			}

			const armazenado = obterTokenArmazenado(token);
			if (!armazenado.access_token) return token;

			if (!armazenado.usuario) {
				const usuario = decodificarUsuario(armazenado.access_token);
				if (usuario) armazenado.usuario = usuario;
			}

			const expirado =
				armazenado.usuario?.exp != null &&
				armazenado.usuario.exp * 1000 < Date.now();

			if (expirado && armazenado.refresh_token) {
				const renovado = await renovarTokens(armazenado.refresh_token);
				if (renovado) {
					armazenado.access_token = renovado.access_token;
					armazenado.refresh_token = renovado.refresh_token;
					armazenado.usuario =
						decodificarUsuario(renovado.access_token) ?? armazenado.usuario;
				}
			}

			token.user = armazenado;
			return token;
		},
		async session({ session, token }) {
			const armazenado = obterTokenArmazenado(token);
			if (!armazenado.access_token) return session;

			const usuario =
				armazenado.usuario ?? decodificarUsuario(armazenado.access_token);
			if (!usuario) return session;

			return {
				...session,
				access_token: armazenado.access_token,
				refresh_token: armazenado.refresh_token ?? '',
				usuario,
			};
		},
	},
	pages: {
		signIn: '/login',
		error: '/login',
	},
} satisfies NextAuthConfig;
