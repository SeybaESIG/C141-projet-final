<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">À propos</h1>

    <v-card max-width="900" class="mx-auto">
      <v-card-text class="pa-6">
        <p class="text-body-1 mb-4">
          <strong>L'encyclopédie des aéroports</strong> est une application web qui permet de consulter des aéroports suisses,
          leurs informations principales, leur canton et leur localisation sur carte.
        </p>

        <p class="text-body-1 mb-6">
          Ce projet a été réalisé dans le cadre du cours <strong>C141</strong> à l'ESIG pour mettre en pratique
          la Composition API, la gestion d'état avec Pinia et la création d'une interface responsive avec Vuetify.
        </p>

        <v-row>
          <v-col cols="12" md="6">
            <h2 class="text-h6 mb-2">Fonctionnalités principales</h2>
            <ul class="pl-5">
              <li>Recherche, filtre par canton et tri alphabétique</li>
              <li>Page détail avec drapeau cantonal et carte Google Maps</li>
              <li>Ajout / suppression de favoris avec persistance locale</li>
            </ul>
          </v-col>

          <v-col cols="12" md="6">
            <h2 class="text-h6 mb-2">Stack technique</h2>
            <div class="d-flex flex-wrap ga-2">
              <v-chip size="small" color="primary" variant="tonal">Vue 3</v-chip>
              <v-chip size="small" color="primary" variant="tonal">Vuetify 3</v-chip>
              <v-chip size="small" color="primary" variant="tonal">Pinia</v-chip>
              <v-chip size="small" color="primary" variant="tonal">Vue Router</v-chip>
              <v-chip size="small" color="primary" variant="tonal">Axios</v-chip>
              <v-chip size="small" color="primary" variant="tonal">Vite</v-chip>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>