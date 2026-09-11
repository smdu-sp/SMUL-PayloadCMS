---
spec: SPEC-045
title: Video Embed Block
status: planned
source: CMS-NOVO-CICLO-SPECS-042-050.md
---

> **Regra de execução:** implemente exclusivamente esta Spec. Não antecipe funcionalidades futuras. Ao finalizar, valide lint, typecheck, testes e build aplicáveis, registre decisões e declare explicitamente o que não foi implementado.

## SPEC-045 — Video Embed Block

### Objetivo

Permitir a inclusão de vídeos através de URL.

### Estrutura conceitual

```text
VideoBlock
├── url
├── title?
├── caption?
├── provider
└── aspectRatio
```

### Providers iniciais

```text
YouTube
Vimeo
```

### Fluxo

```text
URL
↓
identificação do provider
↓
extração do ID
↓
renderização controlada pelo frontend
```

### Segurança

Não permitir:

```text
HTML arbitrário
iframe arbitrário
embed code digitado pelo editor
```

O CMS deve armazenar conteúdo e configuração.

O frontend controla como o embed é renderizado.

### Critérios de aceite

- URLs de providers suportados são reconhecidas.
- URLs inválidas são rejeitadas.
- HTML arbitrário não é aceito.
- Embed é responsivo.
- Vídeo possui título acessível.
- Aspect ratio é controlado.

---

# 4. Styling e governança visual
