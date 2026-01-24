import { useEffect } from 'react';

type MetaOptions = {
  title?: string;
  description?: string;
  image?: string;
};

function ensureMeta(nameOrProp: string, value: string, isProperty = false) {
  const selector = isProperty ? `meta[property="${nameOrProp}"]` : `meta[name="${nameOrProp}"]`;
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    if (isProperty) el.setAttribute('property', nameOrProp);
    else el.setAttribute('name', nameOrProp);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export default function usePageMeta(opts: MetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    if (opts.title) document.title = opts.title;

    const prevDescription = (document.querySelector('meta[name="description"]') as HTMLMetaElement | null)?.getAttribute('content') || '';

    if (opts.description) ensureMeta('description', opts.description);

    // Open Graph
    if (opts.title) ensureMeta('og:title', opts.title, true);
    if (opts.description) ensureMeta('og:description', opts.description, true);
    if (opts.image) ensureMeta('og:image', opts.image, true);

    // Twitter
    ensureMeta('twitter:card', 'summary_large_image');
    if (opts.title) ensureMeta('twitter:title', opts.title);
    if (opts.description) ensureMeta('twitter:description', opts.description);
    if (opts.image) ensureMeta('twitter:image', opts.image);

    return () => {
      document.title = prevTitle;
      if (opts.description) {
        const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (desc) desc.setAttribute('content', prevDescription);
      }
      // We intentionally leave OG/twitter tags as they will be overwritten by next pages.
    };
  }, [opts.title, opts.description, opts.image]);
}
