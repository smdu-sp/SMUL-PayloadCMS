import type { Footer } from "../../payload-types";
import { isSocialIcon } from "../../domain/icons";
import { resolveOfficialHttpsUrl } from "../../domain/official-url";
import { normalizeColorScheme } from "../../lib/theme/block-color-theme";
import { BlockThemeScope, ColorScope, Container, Icon } from "../ui";

function telephoneHref(phone: string): string {
  return `tel:${phone.replace(/(?!^\+)[^\d]/g, "")}`;
}

export function SiteFooter({ footer }: { footer?: Footer | null }) {
  const socialLinks = (footer?.socialLinks ?? []).flatMap((item) => {
    const href = resolveOfficialHttpsUrl(item.url);
    return href && item.label.trim()
      ? [{ href, icon: isSocialIcon(item.icon) ? item.icon : null, label: item.label }]
      : [];
  });
  const institutionalLinks = (footer?.institutionalLinks ?? []).flatMap((item) => {
    const href = resolveOfficialHttpsUrl(item.url);
    return href && item.label.trim() ? [{ href, label: item.label }] : [];
  });
  const hasContact = Boolean(
    footer?.phone || footer?.email || footer?.address || footer?.inPersonService,
  );

  if (!hasContact && !socialLinks.length && !institutionalLinks.length) return null;

  const customTheme = footer?.appearance?.scheme === "custom";
  const content = (
    <ColorScope
      as="footer"
      className="mt-auto border-t border-(--block-border)"
      scheme={customTheme ? "default" : normalizeColorScheme(footer?.appearance?.scheme, "muted")}
    >
      <Container size="xl">
        <div className="grid gap-8 py-10 md:grid-cols-3">
          {hasContact ? (
            <section aria-labelledby="footer-contact-title">
              <h2 className="text-lg font-bold text-(--block-heading)" id="footer-contact-title">
                Atendimento
              </h2>
              <div className="mt-3 space-y-2 text-sm">
                {footer?.phone ? (
                  <p><a className="underline underline-offset-4" href={telephoneHref(footer.phone)}>{footer.phone}</a></p>
                ) : null}
                {footer?.email ? (
                  <p><a className="underline underline-offset-4" href={`mailto:${footer.email}`}>{footer.email}</a></p>
                ) : null}
                {footer?.address ? <address className="whitespace-pre-line not-italic">{footer.address}</address> : null}
                {footer?.inPersonService ? <p className="whitespace-pre-line">{footer.inPersonService}</p> : null}
              </div>
            </section>
          ) : null}

          {institutionalLinks.length ? (
            <nav aria-labelledby="footer-institutional-title">
              <h2 className="text-lg font-bold text-(--block-heading)" id="footer-institutional-title">
                Links institucionais
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {institutionalLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a className="underline underline-offset-4" href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {socialLinks.length ? (
            <nav aria-labelledby="footer-social-title">
              <h2 className="text-lg font-bold text-(--block-heading)" id="footer-social-title">
                Redes sociais
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {socialLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a
                      className="inline-flex items-center gap-2 underline underline-offset-4"
                      href={link.href}
                    >
                      {link.icon ? <Icon name={link.icon} size="xl" tone="current" /> : null}
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </ColorScope>
  );

  return customTheme
    ? <BlockThemeScope palette={footer?.appearance?.colors}>{content}</BlockThemeScope>
    : content;
}
