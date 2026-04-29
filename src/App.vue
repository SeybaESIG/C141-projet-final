<template>
  <v-app>
    <app-header />

    <v-progress-linear
      v-if="isLoading"
      indeterminate
      color="primary"
      height="3"
    />

    <v-main>
      <RouterView />
    </v-main>
    <app-footer />
  </v-app>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import AppHeader from "@/components/AppHeader.vue";
import AppFooter from "@/components/AppFooter.vue";
import { useAeroportStore } from "@/stores/aeroportStore";

const aeroportStore = useAeroportStore();
const { isLoading } = storeToRefs(aeroportStore);

onMounted(async () => {
  await aeroportStore.init();
});
</script>
