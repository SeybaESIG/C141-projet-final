<template>
  <!-- En-tête de l'application avec un logo, un titre et des liens de navigation -->
  <v-app-bar flat>
    <v-container class="d-flex align-center">
      <v-avatar
        class="mr-4 pa-0 cursor-pointer"
        image="/public/airplane.png"
        size="55"
        @click="$router.push('/')"
      />

      <v-toolbar-title>L'encyclopédie des aéroports</v-toolbar-title>

      <v-btn
        v-for="link in menuItems"
        :key="link.title"
        :icon="link.icon"
        :to="link.path"
      />
    </v-container>
  </v-app-bar>
</template>

<script setup>
const menuItems = [
  { title: 'Accueil', path: '/', icon: 'mdi-home' },
  { title: 'Favoris', path: '/favoris', icon: 'mdi-heart' },
  { title: 'À propos', path: '/a-propos', icon: 'mdi-information' },
]
</script>
