import { getCollection, type CollectionEntry } from 'astro:content';

export type Oeuvre = CollectionEntry<'oeuvres'>;

export async function toutesLesOeuvres(): Promise<Oeuvre[]> {
  const oeuvres = await getCollection('oeuvres');
  return oeuvres.sort((a, b) => a.data.ordre - b.data.ordre || b.data.annee - a.data.annee);
}

export async function oeuvreVedette(): Promise<Oeuvre> {
  const oeuvres = await toutesLesOeuvres();
  return oeuvres.find((o) => o.data.vedette) ?? oeuvres[0];
}

/** Clé de filtre stable : minuscules, sans accents ni espaces. */
export const cle = (texte: string) =>
  texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/** Matériau principal : premier mot (« Bronze patiné » → « Bronze »). */
export const materiauPrincipal = (materiaux: string) => {
  const premier = materiaux.split(/[\s,]+/)[0] ?? materiaux;
  return premier.charAt(0).toUpperCase() + premier.slice(1).toLowerCase();
};

export const libellePrix = (o: Oeuvre) =>
  o.data.disponible ? (o.data.prix?.trim() ? o.data.prix : 'Prix sur demande') : 'Collection privée';
