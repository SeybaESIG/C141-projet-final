<template>
  <v-app-bar flat color="primary">
    <v-container class="d-flex align-center">
      <v-app-bar-nav-icon class="d-md-none" @click="drawer = !drawer" />

      <v-avatar class="mr-4 pa-0 cursor-pointer logo-avatar" size="55" @click="$router.push('/')">
        <v-img src="/src/assets/airplane.png" alt="Logo avion" />
      </v-avatar>

      <v-toolbar-title
        class="cursor-pointer header-title"
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

// Navigation principale affichée dans l'app bar et le menu mobile.
const menuItems = [
  { title: "Accueil", path: "/", icon: "mdi-home" },
  { title: "Favoris", path: "/favoris", icon: "mdi-heart" },
  { title: "À propos", path: "/a-propos", icon: "mdi-information" },
];
</script>

<style scoped>
/* Recolore l'image du logo en blanc pour l'intégrer à l'app bar primaire. */
.logo-avatar :deep(img) {
  filter: brightness(0) invert(1);
}

.header-title {
  color: white;
  font-weight: 600;
}
</style>
