import type { Metadata } from "next";
import Link from "next/link";

import { Card, Container, Heading, Section, Text } from "../../../components/ui";
import {
  normalizeSearchPage,
  normalizeSearchQuery,
  SEARCH_QUERY_MIN_LENGTH,
  searchPublishedPages,
} from "../../../lib/payload/search-pages";

export const metadata: Metadata = {
  title: "Busca",
  robots: {
    index: false,
    follow: true,
  },
};

type SearchPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    q?: string | string[];
  }>;
};

function getSearchHref(query: string, page: number): string {
  const params = new URLSearchParams({ q: query });
  if (page > 1) params.set("page", String(page));
  return `/busca?${params.toString()}`;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = normalizeSearchQuery(params.q);
  const requestedPage = normalizeSearchPage(params.page);
  const canSearch = query.length >= SEARCH_QUERY_MIN_LENGTH;
  let response = { page: 1, results: [], totalDocs: 0, totalPages: 0 } as Awaited<
    ReturnType<typeof searchPublishedPages>
  >;
  let failed = false;

  if (canSearch) {
    try {
      response = await searchPublishedPages(query, requestedPage);
    } catch {
      failed = true;
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Section scheme="default" spacing="lg">
        <Container size="md">
          <Heading level={1} size="display">
            Busca
          </Heading>

          <form action="/busca" className="mt-8 flex flex-col gap-3 sm:flex-row" role="search">
            <label className="sr-only" htmlFor="page-search-query">
              Buscar no portal
            </label>
            <input
              className="min-w-0 flex-1 rounded-md border border-(--block-border) bg-[var(--color-surface)] px-4 py-3 text-[var(--color-surface-foreground)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              defaultValue={query}
              id="page-search-query"
              maxLength={100}
              name="q"
              placeholder="Digite o que você procura"
              type="search"
            />
            <button
              className="rounded-md bg-(--block-action) px-5 py-3 font-semibold text-(--block-action-foreground) outline-none hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
              type="submit"
            >
              Buscar
            </button>
          </form>

          <div aria-live="polite" className="mt-8">
            {!query ? (
              <Text>Informe um termo para buscar nas páginas do portal.</Text>
            ) : !canSearch ? (
              <Text>Digite pelo menos dois caracteres para realizar a busca.</Text>
            ) : failed ? (
              <Text>Não foi possível realizar a busca agora. Tente novamente.</Text>
            ) : response.totalDocs === 0 ? (
              <Text>Nenhuma página encontrada para “{query}”.</Text>
            ) : (
              <Text>
                {response.totalDocs} {response.totalDocs === 1 ? "resultado encontrado" : "resultados encontrados"} para “{query}”.
              </Text>
            )}
          </div>

          {response.results.length ? (
            <ul className="mt-6 space-y-4">
              {response.results.map((result) => (
                <li key={result.id}>
                  <Card padding="md" scheme="surface">
                    <Heading level={2} size="md">
                      <Link className="underline underline-offset-4" href={result.href}>
                        {result.title}
                      </Link>
                    </Heading>
                    {result.description ? (
                      <div className="mt-2">
                        <Text>{result.description}</Text>
                      </div>
                    ) : null}
                  </Card>
                </li>
              ))}
            </ul>
          ) : null}

          {response.totalPages > 1 ? (
            <nav aria-label="Paginação dos resultados" className="mt-8 flex items-center justify-between gap-4">
              {response.page > 1 ? (
                <Link className="font-semibold underline underline-offset-4" href={getSearchHref(query, response.page - 1)}>
                  Página anterior
                </Link>
              ) : <span />}
              <span>
                Página {response.page} de {response.totalPages}
              </span>
              {response.page < response.totalPages ? (
                <Link className="font-semibold underline underline-offset-4" href={getSearchHref(query, response.page + 1)}>
                  Próxima página
                </Link>
              ) : <span />}
            </nav>
          ) : null}
        </Container>
      </Section>
    </main>
  );
}
