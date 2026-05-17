import { useEffect } from "react";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_TWITTER,
  DEFAULT_SOCIAL_IMAGE,
  absoluteUrl,
} from "@/lib/site";

interface SEOProps {
  /** Page title; SITE_NAME is appended unless `titleTemplate` is overridden. */
  title?: string;
  description?: string;
  /** Path relative to the site root, e.g. "/auth". Defaults to current pathname. */
  path?: string;
  /** Absolute or root-relative image URL for social previews. */
  image?: string;
  /** "website" (default) or "article". */
  type?: "website" | "article";
  /** Prevent search-engine indexing for this page. */
  noindex?: boolean;
  /** JSON-LD structured-data objects to add to the document head. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /**
   * Override the default `${title} · ${SITE_NAME}` pattern.
   * Pass a function receiving the raw title.
   */
  titleTemplate?: (title: string) => string;
}

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
  return el;
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
  return el;
}

function removeMeta(selector: string) {
  const el = document.head.querySelector(selector);
  if (el) el.parentElement?.removeChild(el);
}

/**
 * Drop-in per-page SEO manager. Updates document.title, meta description,
 * canonical, OG/Twitter tags, and (optionally) JSON-LD structured data.
 *
 * Renders nothing — uses an effect so it works in SPAs without react-helmet.
 */
export function SEO({
  title,
  description = SITE_DESCRIPTION,
  path,
  image = DEFAULT_SOCIAL_IMAGE,
  type = "website",
  noindex = false,
  jsonLd,
  titleTemplate,
}: SEOProps) {
  useEffect(() => {
    const resolvedPath =
      path ?? (typeof window !== "undefined" ? window.location.pathname : "/");
    const canonical = absoluteUrl(resolvedPath);

    const fullTitle = title
      ? titleTemplate
        ? titleTemplate(title)
        : `${title} · ${SITE_NAME}`
      : SITE_NAME;

    document.title = fullTitle;

    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex,nofollow" : "index,follow",
    });

    upsertLink("canonical", canonical);

    // Open Graph
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: SITE_NAME,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: fullTitle,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: canonical,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image.startsWith("http") ? image : absoluteUrl(image),
    });
    upsertMeta('meta[property="og:locale"]', {
      property: "og:locale",
      content: SITE_LOCALE,
    });

    // Twitter
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    if (SITE_TWITTER) {
      upsertMeta('meta[name="twitter:site"]', {
        name: "twitter:site",
        content: SITE_TWITTER,
      });
    } else {
      // No real handle yet — make sure no fictional one is left behind from
      // index.html / a previous page render.
      removeMeta('meta[name="twitter:site"]');
    }
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: fullTitle,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image.startsWith("http") ? image : absoluteUrl(image),
    });

    // JSON-LD structured data
    const existing = document.head.querySelectorAll<HTMLScriptElement>(
      'script[type="application/ld+json"][data-seo="page"]'
    );
    existing.forEach((node) => node.parentElement?.removeChild(node));

    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((block) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", "page");
        script.text = JSON.stringify(block);
        document.head.appendChild(script);
      });
    }

    return () => {
      // Clean up JSON-LD on unmount so the next page starts fresh.
      const stale = document.head.querySelectorAll<HTMLScriptElement>(
        'script[type="application/ld+json"][data-seo="page"]'
      );
      stale.forEach((node) => node.parentElement?.removeChild(node));
    };
  }, [
    title,
    description,
    path,
    image,
    type,
    noindex,
    titleTemplate,
    jsonLd,
  ]);

  return null;
}

export { SITE_URL, SITE_NAME };
