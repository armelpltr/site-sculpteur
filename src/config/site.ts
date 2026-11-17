/**
 * Contenu centralisé du site. Toutes les informations entre crochets
 * sont des placeholders à remplacer avec l'artiste.
 */
export const site = {
  nom: '[Prénom Nom]',
  metier: 'Sculpteur',
  accroche: 'La matière comme un souffle retenu.',
  bioCourte:
    "[Bio courte : deux ou trois phrases sur l'artiste, ses matériaux de prédilection et ce qui l'anime.]",
  description:
    "Portfolio de [Prénom Nom], sculpteur : bronze, marbre, bois et acier. Œuvres disponibles, expositions et contact.",
  ville: '[Ville]',
  atelier: "[Adresse de l'atelier, visites sur rendez-vous]",
  email: 'contact@exemple-sculpteur.fr',
  telephone: '' as string, // facultatif, laissé vide = non affiché
  langue: 'fr-FR',
  reseaux: {
    instagram: 'https://www.instagram.com/[compte]',
    facebook: '',
    linkedin: '',
  },
  /** Formulaire : 'netlify' (Netlify Forms) ou 'formspree'. */
  formulaire: {
    service: 'netlify' as 'netlify' | 'formspree',
    formspreeId: '', // ex. 'xyzabcd' si service = 'formspree'
  },
  /** Protection légère des images (contournable, voir README). */
  protection: {
    clicDroitLightbox: true,
    filigrane: false,
    texteFiligrane: '© [Prénom Nom]',
  },
  legal: {
    editeur: '[Prénom Nom], artiste-auteur',
    siret: '[SIRET ou n° MDA / URSSAF artistes-auteurs]',
    adresse: '[Adresse postale]',
    directeurPublication: '[Prénom Nom]',
    hebergeur: '[Netlify, Inc. – 512 2nd Street, Suite 200, San Francisco, CA 94107, USA] ou [Vercel Inc.]',
    misAJour: '18 novembre 2026',
  },
} as const;

export const navigation = [
  { href: '/galerie', label: 'Galerie' },
  { href: '/artiste', label: "L'artiste" },
  { href: '/expositions', label: 'Expositions' },
  { href: '/contact', label: 'Contact' },
] as const;
