---
spec: SPEC-041
title: Image Editing Canvas
status: implemented
source: Specs030-041-MaturidadeEditorialeGovernancadoCMS.md
---

> **Regra de execucao:** implemente exclusivamente esta Spec. Nao antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicaveis, registre decisoes e declare explicitamente o que nao foi implementado.

# SPEC-041 - Image Editing Canvas

## Objetivo validado

Permitir que o editor configure visualmente cada uso de uma imagem sem modificar o asset de `Media`.

```text
Media (arquivo original unico)
  -> Block A: corte/foco/rotacao A
  -> Block B: corte/foco/rotacao B
  -> Block C: apresentacao original
```

A configuracao e parte da ocorrencia do Block em `Pages.layout`, e nao da imagem compartilhada.

## Escopo funcional

O Canvas oferece:

- crop visual em percentuais;
- ponto focal por clique, arraste ou teclado;
- rotacao em intervalos de 90 graus;
- proporcoes fechadas definidas pelo Block;
- preview no Admin;
- restauracao da apresentacao;
- renderizacao responsiva baseada no mesmo asset original.

## Contrato de persistencia

```ts
type ImageCanvasValue = {
  crop: { x: number; y: number; width: number; height: number }
  focalPoint: { x: number; y: number }
  rotation: 0 | 90 | 180 | 270
}
```

Todos os valores geometricos sao percentuais entre `0` e `100`. O crop deve permanecer dentro da imagem e possuir pelo menos `5%` em cada dimensao.

## Relacao com a SPEC-034

A interpretacao inicial previa a geracao de um novo asset. A decisao de produto validada para esta implementacao substitui essa leitura: a SPEC-041 estende os controles da SPEC-034 com uma experiencia visual de enquadramento por ocorrencia. A imagem original deve permanecer intacta e nenhum derivado deve ser criado.

## Arquitetura

```text
Payload Block config
  -> JSON canvas opcional ao lado do upload
  -> regra pura em src/domain/image-presentation.ts
  -> componente Admin apenas edita o JSON da ocorrencia
  -> renderer aplica o JSON sobre MediaImage
  -> Media e storage permanecem inalterados
```

O editor nao chama endpoint de processamento de imagem. O preview rotacionado e gerado localmente no navegador e salvo apenas como metadados do documento.

## Compatibilidade

- Campos Canvas sao aditivos e opcionais; os grupos novos de Galeria e Carrossel usam defaults seguros.
- Pages existentes continuam renderizando com os defaults da SPEC-034.
- O ponto focal global de `Media` permanece como fallback quando nao ha Canvas por ocorrencia.
- Campos legados de derivados em `Media` sao preservados temporariamente para evitar uma remocao destrutiva sem migration.

## Definition of Done

- [x] Um mesmo asset pode possuir apresentacoes diferentes em Blocks diferentes.
- [x] O Canvas nao altera nem cria registros em `Media`.
- [x] Crop, ponto focal e rotacao sao validados por regra de dominio.
- [x] Blocks com imagem renderizam o contrato por ocorrencia.
- [x] Documentos anteriores possuem fallback seguro.
- [x] A estrategia de migration esta registrada.
- [x] Tipos do Payload foram regenerados.
- [x] Lint, typecheck, testes e build aplicaveis sao executados antes da entrega.

## Nao implementado

- filtros ou ajustes fotograficos;
- texto ou desenho sobre imagens;
- overwrite do original;
- geracao e gerenciamento de derivados;
- configuracao responsiva manual fora dos campos desktop/mobile ja previstos pelos Blocks;
- remocao dos campos legados de `Media`.
