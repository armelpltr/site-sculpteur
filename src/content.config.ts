import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const oeuvres = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/oeuvres' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string().min(1),
      annee: z.number().int().min(1900).max(2100),
      materiaux: z.string().min(1),
      dimensions: z.string().min(1),
      serie: z.string().optional(),
      disponible: z.boolean(),
      prix: z.string().optional(),
      // Mise en avant sur la page d'accueil (une seule œuvre suffit).
      vedette: z.boolean().default(false),
      // Ordre d'affichage dans la galerie (plus petit = en premier).
      ordre: z.number().default(100),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string().trim().min(1, "Le texte alternatif (alt) est obligatoire pour chaque image."),
          }),
        )
        .min(1, 'Au moins une image est requise (la première sert de couverture).'),
    }),
});

const expositions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/expositions' }),
  schema: z.object({
    titre: z.string(),
    lieu: z.string(),
    ville: z.string(),
    debut: z.coerce.date(),
    fin: z.coerce.date().optional(),
    type: z.enum(['exposition personnelle', 'exposition collective', 'salon', 'actualité']),
    lien: z.string().url().optional(),
  }),
});

export const collections = { oeuvres, expositions };
