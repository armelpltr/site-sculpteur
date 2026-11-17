# Site vitrine : portfolio de sculptures

Site statique minimaliste façon galerie d'art, construit avec **Astro** et **Tailwind CSS**.
Les œuvres sont de simples fichiers Markdown : en ajouter une ne demande pas de toucher au code.

> Les six œuvres, le portrait et la photo d'atelier fournis sont **fictifs** (formes abstraites générées).
> Ils sont à remplacer par les vraies photos de l'artiste.

## Sommaire

- [Lancer le site en local](#lancer-le-site-en-local)
- [Modifier les informations générales](#modifier-les-informations-générales)
- [Ajouter une œuvre pas à pas](#ajouter-une-œuvre-pas-à-pas)
- [Ajouter une exposition ou une actualité](#ajouter-une-exposition-ou-une-actualité)
- [Déployer](#déployer)
- [Decap CMS (optionnel, non activé)](#decap-cms-optionnel-non-activé)
- [Protection des images : limites](#protection-des-images--limites)
- [Structure du projet](#structure-du-projet)
- [Avant la mise en ligne](#avant-la-mise-en-ligne)

## Lancer le site en local

Prérequis : Node.js 22 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:4321
```

Autres commandes :

| Commande          | Rôle                                                       |
| ----------------- | ---------------------------------------------------------- |
| `npm run build`   | Génère le site statique dans `dist/`                       |
| `npm run preview` | Sert `dist/` en local pour vérifier le build               |
| `npm run check`   | Vérifie les types et le schéma du contenu                  |

## Modifier les informations générales

Tout est centralisé dans [`src/config/site.ts`](src/config/site.ts) : nom, accroche, bio courte, ville,
adresse de l'atelier, e-mail, réseaux sociaux, choix du service de formulaire, options de protection
des images et informations légales.

L'URL définitive du site se règle dans [`astro.config.mjs`](astro.config.mjs) (`SITE_URL`) : elle sert au
sitemap, aux URL canoniques et aux aperçus Open Graph.

Les textes longs de la page « L'artiste » (biographie, démarche, parcours) sont dans
[`src/pages/artiste.astro`](src/pages/artiste.astro). Le portrait et la photo d'atelier sont
`src/assets/portrait.jpg` et `src/assets/atelier.jpg` (même nom de fichier = rien d'autre à changer).

## Ajouter une œuvre pas à pas

1. **Préparer les photos.** Format JPG ou PNG, idéalement 2 000 à 3 000 px sur le grand côté. Inutile
   de les compresser : le site génère automatiquement des versions WebP et AVIF à plusieurs tailles.
2. **Copier les photos** dans `src/content/oeuvres/images/`, en les nommant sans espaces ni accents,
   par exemple `lumiere-du-nord-1.jpg`, `lumiere-du-nord-2.jpg`.
3. **Créer le fichier** `src/content/oeuvres/lumiere-du-nord.md`. Le nom du fichier devient l'adresse
   de la page : `/oeuvres/lumiere-du-nord`.
4. **Remplir l'en-tête** en copiant ce modèle :

   ```markdown
   ---
   titre: Lumière du nord
   annee: 2026
   materiaux: Bronze patiné
   dimensions: "45 × 30 × 20 cm"
   serie: Respirations          # facultatif
   disponible: true             # true = à vendre, false = collection privée
   prix: "3 500 €"              # facultatif : vide = « Prix sur demande »
   vedette: false               # true = image plein écran de la page d'accueil
   ordre: 7                     # position dans la galerie (plus petit = en premier)
   images:
     - src: ./images/lumiere-du-nord-1.jpg
       alt: "Lumière du nord, buste en bronze vu de trois quarts"
     - src: ./images/lumiere-du-nord-2.jpg
       alt: "Lumière du nord, détail de la patine sur l'épaule"
   ---

   Texte de présentation de l'œuvre, en Markdown : *italique*, **gras**, paragraphes…
   ```

5. **Vérifier** avec `npm run dev`. Si un champ manque ou si un texte alternatif (`alt`) est vide, le
   site refuse de se construire et indique précisément l'erreur.
6. **Publier** : `git add . && git commit -m "Ajout de l'œuvre Lumière du nord" && git push`. Netlify ou
   Vercel reconstruit le site automatiquement.

Règles à retenir :

- La **première image** de la liste est la couverture (galerie, aperçu sur les réseaux sociaux).
- Le champ **`alt` est obligatoire** pour chaque image : il décrit la photo aux personnes malvoyantes
  et aide le référencement.
- Les filtres de la galerie se construisent tout seuls à partir des séries et des matériaux saisis. Le
  filtre « matériau » prend le premier mot du champ `materiaux` (« Bronze patiné » → « Bronze »).
- Une seule œuvre devrait avoir `vedette: true`. Si elle a une photo au format paysage, c'est celle-ci
  qui s'affiche en plein écran sur ordinateur.

## Ajouter une exposition ou une actualité

Créer un fichier dans `src/content/expositions/`, par exemple `2027-galerie-x.md` :

```markdown
---
titre: "Titre de l'exposition"
lieu: "Galerie X"
ville: "Lyon"
debut: 2027-05-10
fin: 2027-06-20                 # facultatif
type: exposition personnelle    # ou : exposition collective, salon, actualité
lien: https://…                 # facultatif
---

Quelques lignes de présentation.
```

Le classement « À venir / Passées » est automatique et se met à jour chaque jour, même sans
reconstruire le site.

## Déployer

### GitHub Pages (aperçu en ligne, actif)

Chaque push sur `main` publie le site sur **https://armelpltr.github.io/site-sculpteur/** via
`.github/workflows/pages.yml`. Le workflow construit le site avec `SITE_URL` et `BASE_PATH`, puis
`scripts/prefixer-base.mjs` ajoute le sous-dossier `/site-sculpteur/` aux liens internes et aux URL absolues.

Limite : GitHub Pages est un hébergement statique, **le formulaire Netlify Forms n'y fonctionne pas**.
Pour un formulaire fonctionnel sur Pages, passer sur Formspree (`formulaire.service: 'formspree'`).

Rien n'est déployé pour l'instant. Les deux configurations sont prêtes :

### Netlify (recommandé : le formulaire fonctionne sans service tiers)

1. Sur [app.netlify.com](https://app.netlify.com), « Add new site » puis « Import an existing project »,
   choisir ce dépôt GitHub.
2. Les réglages sont lus dans `netlify.toml` (build `npm run build`, dossier `dist`).
3. Dans `src/config/site.ts`, laisser `formulaire.service: 'netlify'`. Les messages arrivent dans
   l'onglet **Forms** de Netlify ; activer une notification e-mail vers l'artiste.
4. Brancher le nom de domaine dans « Domain management », puis mettre à jour `SITE_URL`.

### Vercel

1. Sur [vercel.com](https://vercel.com), « Add New Project », importer ce dépôt. Les réglages sont lus
   dans `vercel.json`.
2. Netlify Forms ne fonctionne pas sur Vercel : créer un formulaire sur [formspree.io](https://formspree.io),
   puis dans `src/config/site.ts` mettre `service: 'formspree'` et `formspreeId: '<identifiant>'`.

## Decap CMS (optionnel, non activé)

Une interface d'administration est **préparée mais désactivée** : ses fichiers sont dans `cms/admin/`,
hors du dossier `public/`, donc non publiés. Elle permettrait à l'artiste d'ajouter ses œuvres depuis
`https://<site>/admin`, sans Git.

Pour l'activer (hébergement Netlify uniquement avec cette configuration) :

1. Déplacer le dossier : `git mv cms/admin public/admin`.
2. Dans Netlify : **Site configuration → Identity → Enable Identity**, passer l'inscription en
   « Invite only », puis activer **Git Gateway** (Identity → Services).
3. Inviter l'artiste par e-mail depuis l'onglet Identity.
4. Mettre à jour `site_url` et `display_url` dans `public/admin/config.yml`.
5. Ajouter ce script dans le `<head>` de `src/layouts/Base.astro` pour finaliser la connexion après
   l'invitation :
   `<script is:inline src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>`

Le mode `editorial_workflow` est activé : chaque œuvre passe par un brouillon puis une validation avant
publication. Le CMS impose aussi une description (`alt`) non vide pour chaque photo.

## Protection des images : limites

Deux protections légères sont proposées dans `src/config/site.ts` (`protection`) :

- `clicDroitLightbox` : désactive le clic droit et le glisser-déposer dans la vue agrandie (activé).
- `filigrane` : affiche un texte discret (`texteFiligrane`) sur les photos des fiches œuvres (désactivé).

**Ces protections restent contournables** : une capture d'écran, les outils de développement du
navigateur ou la désactivation de JavaScript suffisent à récupérer une image. Elles découragent la copie
occasionnelle, sans plus. Pour une vraie protection : ne publier que des images de taille raisonnable
(2 400 px max., déjà appliqué dans la lightbox), incruster un filigrane directement dans les fichiers
sources, et rappeler les droits d'auteur (mentions légales et fichier `LICENSE`).

## Structure du projet

```
src/
├── config/site.ts           Contenu centralisé (nom, bio, réseaux, e-mail…)
├── content.config.ts        Schéma des œuvres et des expositions
├── content/
│   ├── oeuvres/             Une œuvre = un fichier .md
│   │   └── images/          Photos des œuvres
│   └── expositions/         Un événement = un fichier .md
├── assets/                  Portrait et photo d'atelier
├── layouts/                 Gabarits de page (SEO, Open Graph, JSON-LD)
├── components/              En-tête, pied de page
├── lib/                     Fonctions utilitaires et données structurées
└── pages/                   Une page = un fichier
cms/admin/                   Decap CMS, préparé mais non publié
scripts/                     Génération des images placeholder
```

SEO intégré : balises meta et Open Graph sur chaque page (image de couverture pour les œuvres),
`sitemap-index.xml`, `robots.txt`, JSON-LD `Person` et `VisualArtwork`.

## Avant la mise en ligne

- [ ] Remplacer tous les textes entre crochets (`grep -rn "\[" src/config src/pages`)
- [ ] Remplacer les œuvres fictives, le portrait et l'atelier par les vraies photos
- [ ] Supprimer `scripts/generer-placeholders.mjs` et la commande `placeholders` du `package.json`
- [ ] Renseigner `SITE_URL` (astro.config.mjs) et l'URL dans `cms/admin/config.yml`
- [ ] Compléter les mentions légales et la politique de confidentialité
- [ ] Mettre le nom de l'artiste dans `LICENSE`
- [ ] Tester le formulaire de contact une fois déployé

## Licence

Tous droits réservés. Les photographies des œuvres appartiennent à l'artiste. Voir [`LICENSE`](LICENSE).
