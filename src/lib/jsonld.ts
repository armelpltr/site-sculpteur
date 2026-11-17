import { site } from '@/config/site';
import type { Oeuvre } from '@/lib/oeuvres';

const reseaux = () => Object.values(site.reseaux).filter((u) => u && !u.includes('['));

export function personneJsonLd(base: URL | undefined) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': new URL('/artiste#personne', base).href,
    name: site.nom,
    jobTitle: site.metier,
    description: site.bioCourte,
    url: new URL('/', base).href,
    email: `mailto:${site.email}`,
    address: { '@type': 'PostalAddress', addressLocality: site.ville, addressCountry: 'FR' },
    sameAs: reseaux(),
  };
}

export function oeuvreJsonLd(o: Oeuvre, base: URL | undefined, imageUrl: string) {
  const d = o.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: d.titre,
    url: new URL(`/oeuvres/${o.id}`, base).href,
    image: new URL(imageUrl, base).href,
    dateCreated: String(d.annee),
    artform: 'Sculpture',
    artMedium: d.materiaux,
    size: d.dimensions,
    description: o.body?.replace(/[*_#>]/g, '').trim().slice(0, 300),
    creator: { '@id': new URL('/artiste#personne', base).href, '@type': 'Person', name: site.nom },
    ...(d.serie ? { isPartOf: { '@type': 'CreativeWorkSeries', name: d.serie } } : {}),
    ...(d.disponible && d.prix
      ? { offers: { '@type': 'Offer', price: d.prix.replace(/[^\d,.]/g, '').replace(',', '.'), priceCurrency: 'EUR', availability: 'https://schema.org/InStock' } }
      : {}),
  };
}
