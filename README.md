# Encyclopedie des aeroports

Application Vue 3 + Vuetify 3 + Pinia qui consomme l'API Airlabs pour afficher une liste d'aeroports suisses, une page detail et une gestion des favoris persistants.

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

Le projet utilise des variables Vite (prefixe `VITE_`) :

- `VITE_API_URL` : base URL de l'API Airlabs
- `VITE_AIRLABS_API_KEY` : cle API Airlabs

Voir `env.example` pour le template.

## Structure du projet

```text
src/
├── components/             # Composants reutilisables (header, footer, cards)
├── pages/                  # Pages routees (file-based routing)
│   ├── index.vue
│   ├── aeroport/[id].vue
│   ├── favoris.vue
│   └── a-propos.vue
├── assets/
│   └── cantons/            # Drapeaux des cantons suisses (svg/png)
├── utils/
│   └── cantons.js          # Mapping aeroport -> canton + resolution image drapeau
├── views/                  # Dossier present pour la structure demandee
├── stores/
│   └── aeroportStore.js    # State, getters, actions (Pinia)
├── plugins/
│   ├── axios.js            # Configuration Axios (baseURL + headers)
│   └── vuetify.js
├── router/
│   └── index.js
├── App.vue
└── main.js
```

## Scripts

- `npm run dev` : demarrage local
- `npm run build` : build production
- `npm run preview` : preview de build

## Notes

- Les favoris sont sauvegardes dans `localStorage` (cle `favorite-airports`).
- Le detail aeroport affiche une iframe Google Maps basee sur `lat/lng` retournes par l'API Airlabs.
