# Encyclopédie des aéroports suisses 

Application Vue 3 + Vuetify 3 + Pinia qui consomme l'API Airlabs pour afficher une liste d'aeroports suisses, une page détail et une gestion des favoris persistants.

## Fonctionnalites

- Liste d'aeroports en grille de cartes
- Recherche texte (nom, IATA, ICAO)
- Filtre par canton
- Tri alphabetique (A -> Z, Z -> A)
- Detail aeroport via route dynamique `/aeroport/:id`
- Favoris (ajout/suppression) avec persistance `localStorage`
- Drapeau du canton affiche sur les cartes et la page detail
- Carte Google Maps (iframe) sur la page detail
- Navigation responsive (`v-app-bar` + `v-navigation-drawer`)
- Feedback utilisateur (`v-progress-linear`, `v-dialog`, `v-snackbar`, `v-alert`)

## Stack technique

- Vue.js 3 (Composition API avec `<script setup>`)
- Vuetify 3
- Pinia
- Axios
- Vue Router (file-based routing via `unplugin-vue-router`)
- Vite 5

## Installation

```bash
npm install
cp env.example .env
npm run dev
```

Application disponible sur `http://localhost:3000`.

## Variables d'environnement

Le projet utilise :

- `VITE_API_URL` : base URL des appels frontend (par defaut `/api`)
- `VITE_AIRLABS_API_KEY` : cle API Airlabs 

Voir `env.example` pour le template.

## Structure du projet

```text
.
├── api/
│   └── airports.js               # Proxy serverless Vercel vers Airlabs
├── index.html                    # Point d'entree HTML (Vite)
├── vite.config.mjs               # Configuration Vite (alias, plugins)
├── env.example                   # Template des variables d'environnement
└── src/
    ├── App.vue                   # Composant racine
    ├── main.js                   # Bootstrap Vue (Pinia, Router, Vuetify)
    ├── assets/
    │   ├── airplane.png
    │   └── cantons/              # Drapeaux des cantons suisses (svg/png)
    ├── components/               # Composants reutilisables
    │   ├── AeroportCard.vue
    │   ├── AppHeader.vue
    │   └── AppFooter.vue
    ├── pages/                    # Pages routees (file-based routing)
    │   ├── index.vue
    │   ├── aeroport/
    │   │   └── [id].vue
    │   ├── favoris.vue
    │   └── a-propos.vue
    ├── router/
    │   └── index.js              # Router (auto-genere depuis src/pages)
    ├── stores/
    │   ├── index.js              # Instance Pinia
    │   └── aeroportStore.js      # State, getters, actions (Pinia)
    ├── plugins/
    │   ├── index.js              # Enregistrement global des plugins
    │   ├── axios.js              # Configuration Axios (baseURL + headers)
    │   └── vuetify.js            # Configuration Vuetify (theme, icones)
    └── utils/
        └── cantons.js            # Mapping aeroport -> canton + resolution drapeau
```

## Scripts

- `npm run dev` : demarrage local
- `npm run build` : build production
- `npm run preview` : preview de build

## Notes

- Les favoris sont sauvegardes dans `localStorage` (cle `favorite-airports`).
- Le detail aéroport affiche une iframe Google Maps basee sur `lat/lng` retournés par l'API Airlabs.
- En production Vercel, configurer `VITE_AIRLABS_API_KEY` dans les Environment Variables.
