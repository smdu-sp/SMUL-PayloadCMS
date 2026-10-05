# Known issues

## CMS foundation

- `payload generate:types` pode falhar no ambiente Windows atual com `uv_os_get_passwd returned ENOMEM`; quando isso ocorre, os tipos precisam ser revisados com cuidado antes das validacoes.
- Migrations destrutivas ainda exigem revisao humana e plano operacional antes de serem aplicadas em bases compartilhadas.
- `Media.usage` possui default seguro. `Users.role` nao possui default e exige o backfill explicito documentado em `schema-evolution-migrations.md`; bases existentes devem ser auditadas antes de producao.

## Visual fidelity

- `heroCountdown`, `mediaHighlight`, `benefitsGrid`, `infoCards` e `stepByStep` ainda sao representados por Blocks equivalentes, nao por componentes dedicados.
- O Hero atual nao executa contagem regressiva dinamica.
- A biblioteca de midia nao gera `imageSizes` pelo Payload neste ciclo; responsividade fica no `next/image` via `MediaImage`.

## Domain features deferred

- Regras de elegibilidade das modalidades permanecem fora da fundacao CMS.
- Integracao CEDI nao foi implementada neste ciclo.
- Documentos, outorga, protocolo administrativo e hardening especifico de dominio continuam pendentes para specs futuras.
