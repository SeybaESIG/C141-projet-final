<template>
  <v-footer class="border-t-sm">
    <v-container class="py-3">
      <div class="d-flex flex-column align-center justify-center ga-1 text-medium-emphasis text-center">
        <div class="text-body-2">
          Encyclopédie des aéroports suisses
        </div>
        <div class="text-body-2">
          C141 · ESIG · {{ currentYear }}
        </div>
      </div>
    </v-container>
  </v-footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
