<template>
  <v-container>
    <h1 class="text-h3 text-center my-6">Mes favoris</h1>

    <div class="d-flex justify-end mb-4" v-if="favoriteAeroports.length > 0">
      <v-btn color="error" variant="tonal" @click="showClearDialog = true">
        Vider les favoris
      </v-btn>
    </div>

    <v-alert v-if="favoriteAeroports.length === 0" type="info" variant="tonal">
      Vous n'avez pas encore d'aéroport favoris.
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="airport in favoriteAeroports"
        :key="airport.icao_code || airport.iata_code || airport.name"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <aeroport-card
          :aeroport="airport"
          :is-favorite="aeroportStore.isFavorite(airport)"
          @toggle-favorite="handleToggleFavorite"
        />
      </v-col>
    </v-row>

    <v-dialog v-model="showClearDialog" max-width="420">
      <v-card>
        <v-card-title>Confirmer</v-card-title>
        <v-card-text>Supprimer tous les favoris ?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="showClearDialog = false">Annuler</v-btn>
          <v-btn color="error" @click="clearAllFavorites">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :timeout="2200" color="success">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import AeroportCard from "@/components/AeroportCard.vue";
import { useAeroportStore } from "@/stores/aeroportStore";

const aeroportStore = useAeroportStore();
const { aeroports } = storeToRefs(aeroportStore);
const showClearDialog = ref(false);
const snackbar = reactive({
  show: false,
  text: "",
});

const favoriteAeroports = computed(() => {
  return aeroports.value.filter((airport) => aeroportStore.isFavorite(airport));
});

function handleToggleFavorite(airport) {
  aeroportStore.toggleFavorite(airport);
  snackbar.text = "Favori mis à jour";
  snackbar.show = true;
}

function clearAllFavorites() {
  aeroportStore.clearFavorites();
  showClearDialog.value = false;
  snackbar.text = "Tous les favoris ont été supprimés";
  snackbar.show = true;
}
</script>