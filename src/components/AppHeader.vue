<template>
  <v-app-bar flat>
    <v-container class="d-flex align-center">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />

      <v-avatar
        class="mr-4 pa-0 cursor-pointer"
        image="/src/assets/airplane.png"
        size="55"
        @click="$router.push('/')"
      />

      <v-toolbar-title
        class="cursor-pointer"
        role="button"
        tabindex="0"
        @click="$router.push('/')"
        @keydown.enter="$router.push('/')"
      >
        L'encyclopédie des aéroports
      </v-toolbar-title>

      <v-btn
        v-for="link in menuItems"
        :key="link.title"
        class="d-none d-md-inline-flex"
        :icon="link.icon"
        :to="link.path"
      />
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="left">
    <v-list nav>
      <v-list-item
        v-for="link in menuItems"
        :key="link.title"
        :prepend-icon="link.icon"
        :title="link.title"
        :to="link.path"
        @click="drawer = false"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from "vue";

const drawer = ref(false);

const menuItems = [
  { title: "Accueil", path: "/", icon: "mdi-home" },
  { title: "Favoris", path: "/favoris", icon: "mdi-heart" },
  { title: "À propos", path: "/a-propos", icon: "mdi-information" },
];
</script>
