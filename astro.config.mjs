// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// SITE_URL / BASE_PATH kommen aus der Umgebung, damit dasselbe Repo ohne
// Code-Änderung auf GitHub Pages (Unterpfad) und auf einer eigenen Domain
// (Root-Pfad) deployt werden kann. Siehe .env.example.
const site = process.env.SITE_URL ?? 'https://jfk100611.github.io';
const base = process.env.BASE_PATH ?? '/jules-web-starter';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  build: {
    // GitHub Pages liefert /pfad/ zuverlässiger aus als /pfad.html
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
