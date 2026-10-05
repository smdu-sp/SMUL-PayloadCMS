\	ext
src/
├── access/
│   ├── roles.test.ts
│   └── roles.ts
├── admin/
│   └── help-content.ts
├── app/
│   ├── (frontend)/
│   │   ├── [...slug]/
│   │   │   └── page.tsx
│   │   ├── [slug]/
│   │   ├── api/
│   │   │   ├── draft/
│   │   │   │   └── route.ts
│   │   │   └── live-preview/
│   │   │       └── route.ts
│   │   ├── busca/
│   │   │   └── page.tsx
│   │   ├── icones/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── sitemap.ts
│   └── (payload)/
│       ├── admin/
│       │   ├── [[...segments]]/
│       │   │   ├── not-found.tsx
│       │   │   └── page.tsx
│       │   └── importMap.js
│       ├── api/
│       │   └── [...slug]/
│       │       └── route.ts
│       ├── graphql/
│       │   └── route.ts
│       ├── graphql-playground/
│       │   └── route.ts
│       ├── custom.scss
│       └── layout.tsx
├── blocks/
│   ├── ActionBanners/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── AlertBox/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── Cards/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   ├── custom-theme.test.ts
│   │   └── image-presentation.test.ts
│   ├── Carousel/
│   │   ├── CarouselClient.tsx
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── CTA/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── FAQ/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── FullWidthImageBanner/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── Gallery/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   ├── custom-theme.test.ts
│   │   └── GalleryLightbox.tsx
│   ├── Hero/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── IconGrid/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── ImageBlock/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── ImageText/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   └── custom-theme.test.ts
│   ├── RichText/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   ├── custom-theme.test.ts
│   │   ├── font-family.test.ts
│   │   ├── font-family.ts
│   │   ├── font-size.ts
│   │   ├── typography-feature.client.tsx
│   │   └── typography-feature.server.ts
│   ├── shared/
│   │   ├── admin.ts
│   │   ├── BlockIcon.tsx
│   │   ├── BlockLink.tsx
│   │   ├── get-block-summary.ts
│   │   ├── image-presentation.test.ts
│   │   ├── image-presentation.ts
│   │   ├── link.ts
│   │   └── MediaImage.tsx
│   ├── VideoBlock/
│   │   ├── Component.tsx
│   │   ├── config.ts
│   │   ├── custom-theme.test.ts
│   │   ├── video-embed.test.ts
│   │   └── video-embed.ts
│   ├── admin-ux-block-visualization.test.ts
│   ├── block-variants.test.ts
│   ├── content-validation.test.ts
│   └── live-preview.test.ts
├── collections/
│   ├── AuditLogs.ts
│   ├── Media.ts
│   ├── Pages.ts
│   ├── Themes.test.ts
│   ├── Themes.ts
│   └── Users.ts
├── components/
│   ├── admin/
│   │   ├── AdminHelpBackButton.test.ts
│   │   ├── AdminHelpBackButton.tsx
│   │   ├── AdminHelpNavLink.tsx
│   │   ├── AdminHelpPage.tsx
│   │   ├── AdminIconsNavLink.tsx
│   │   ├── AdminIconsPage.tsx
│   │   ├── AdminTheme.tsx
│   │   ├── BlockContrastStatus.tsx
│   │   ├── BlockSummaryLabel.tsx
│   │   ├── CharacterLimitedTextField.tsx
│   │   ├── CustomNav.test.ts
│   │   ├── CustomNav.tsx
│   │   ├── HexColorPicker.module.css
│   │   ├── HexColorPicker.tsx
│   │   ├── Icon.tsx
│   │   ├── LdapLoginForm.tsx
│   │   ├── Logo.tsx
│   │   ├── RichTextFullScreen.module.css
│   │   ├── RichTextFullScreen.tsx
│   │   ├── ThemeColorReset.tsx
│   │   └── ViewPageButton.tsx
│   ├── layout/
│   │   ├── HeaderNavigation.tsx
│   │   ├── SiteFooter.tsx
│   │   ├── SiteHeader.tsx
│   │   └── SiteShell.test.ts
│   ├── RenderBlocks/
│   │   └── index.tsx
│   ├── theme/
│   │   ├── AccessibilityThemeProvider.module.css
│   │   └── AccessibilityThemeProvider.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── classNames.ts
│   │   ├── ColorScope.tsx
│   │   ├── Container.tsx
│   │   ├── Heading.tsx
│   │   ├── Icon.test.ts
│   │   ├── Icon.tsx
│   │   ├── index.ts
│   │   ├── primitives.test.ts
│   │   ├── Section.tsx
│   │   ├── Status.tsx
│   │   └── Text.tsx
│   └── LivePreviewPage.tsx
├── domain/
│   ├── icons.test.ts
│   ├── icons.ts
│   ├── official-url.test.ts
│   ├── official-url.ts
│   └── slug.ts
├── fields/
│   ├── block-appearance.ts
│   ├── character-limit.ts
│   ├── editorial-validation.ts
│   ├── icon.ts
│   ├── image-presentation.test.ts
│   ├── image-presentation.ts
│   ├── link.ts
│   ├── seo.ts
│   └── theme.ts
├── globals/
│   ├── shared/
│   │   └── social-link.ts
│   ├── Footer.ts
│   ├── Header.ts
│   ├── site-shell.test.ts
│   └── SiteSettings.ts
├── lib/
│   ├── audit/
│   │   ├── page-audit.test.ts
│   │   └── page-audit.ts
│   ├── ldap/
│   │   ├── auth-strategy.ts
│   │   ├── client.test.ts
│   │   ├── client.ts
│   │   ├── dev-user.ts
│   │   ├── login-endpoint.ts
│   │   ├── sync-user-hook.ts
│   │   └── types.ts
│   ├── navigation/
│   │   ├── resolve-header-navigation.test.ts
│   │   ├── resolve-header-navigation.ts
│   │   ├── resolve-link.test.ts
│   │   └── resolve-link.ts
│   ├── payload/
│   │   ├── get-page.test.ts
│   │   ├── get-page.ts
│   │   ├── get-site-shell.ts
│   │   ├── revalidate-page.ts
│   │   ├── revalidate-site-shell.ts
│   │   ├── search-pages.test.ts
│   │   ├── search-pages.ts
│   │   └── unpublish-workflow.test.ts
│   ├── prisma/
│   │   └── .gitkeep
│   ├── seo/
│   │   ├── metadata.test.ts
│   │   └── metadata.ts
│   └── theme/
│       ├── accessible-palettes.test.ts
│       ├── accessible-palettes.ts
│       ├── block-color-theme.test.ts
│       ├── block-color-theme.ts
│       ├── color-regression.fixture.tsx
│       ├── color-regression.test.ts
│       ├── colors.ts
│       ├── default-theme.ts
│       ├── get-theme.ts
│       ├── google-fonts.test.ts
│       ├── google-fonts.ts
│       ├── map-theme-to-css-variables.test.ts
│       ├── map-theme-to-css-variables.ts
│       ├── resolve-active-theme.test.ts
│       ├── resolve-active-theme.ts
│       ├── semantic-theme.ts
│       └── serve-color-regression.tsx
├── migrations/
├── seeds/
│   ├── create-dev-admin.ts
│   ├── create-first-admin.ts
│   ├── editorial-baseline.ts
│   ├── patch-os-userinfo.mjs
│   ├── run-payload-development.mjs
│   ├── seed-showcase.test.ts
│   └── seed-showcase.ts
├── styles/
│   └── tokens.css
├── cms-editing-ux.test.ts
├── cms-foundation-validation.test.ts
├── cms-schema-evolution.test.ts
├── payload-types.ts
└── payload.config.ts
\\n