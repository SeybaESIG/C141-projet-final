<template>
  <v-container class="py-6">
    <div class="d-flex flex-column flex-md-row align-start align-md-center justify-space-between ga-3 mb-5">
      <div>
        <h1 class="text-h4 text-md-h3 font-weight-bold mb-1">Liste des aéroports</h1>
        <p class="text-medium-emphasis">Recherchez, filtrez et ajoutez vos aéroports favoris.</p>
      </div>
      <div class="d-flex ga-2 flex-wrap">
        <v-chip color="primary" variant="tonal" prepend-icon="mdi-airplane">
          {{ aeroports.length }} aéroports
        </v-chip>
        <v-chip color="error" variant="tonal" prepend-icon="mdi-heart">
          {{ aeroportStore.favorites.length }} favoris
        </v-chip>
      </div>
    </div>

    <v-sheet class="pa-4 pa-md-5 mb-6 filter-panel" border rounded="lg">
      <v-row>
        <v-col cols="12" md="5">
          <v-text-field
            v-model="search"
            label="Rechercher un aéroport"
            variant="outlined"
            density="comfortable"
            prepend-inner-icon="mdi-magnify"
            clearable
            hide-details
          />
        </v-col>

        <v-col cols="12" md="3">
          <v-select
            v-model="selectedCanton"
            :items="cantonOptions"
            item-title="label"
            item-value="value"
            label="Filtrer par canton"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

        <v-col cols="12" md="4">
          <v-select
            v-model="sortOrder"
            :items="sortOptions"
            item-title="label"
            item-value="value"
            label="Trier"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </v-col>

      </v-row>
    </v-sheet>

    <v-row v-if="isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader class="rounded-lg" type="image, heading, text" />
      </v-col>
    </v-row>

    <v-alert v-else-if="error" type="error" class="mb-4" variant="tonal">
      {{ error }}
    </v-alert>

    <template v-else>
      <v-alert
        v-if="filteredAeroports.length === 0"
        type="info"
        variant="tonal"
        class="mb-4"
      >
        Aucun aéroport ne correspond à vos critères.
      </v-alert>

      <v-row justify="center">
        <v-col
          v-for="airport in filteredAeroports"
          :key="airport.icao_code || airport.iata_code || airport.name"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          class="d-flex justify-center"
        >
          <aeroport-card
            :aeroport="airport"
            :is-favorite="aeroportStore.isFavorite(airport)"
            @toggle-favorite="aeroportStore.toggleFavorite"
          />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAeroportStore } from "@/stores/aeroportStore";
import AeroportCard from "@/components/AeroportCard.vue";

const aeroportStore = useAeroportStore();
const { aeroports: aeroportsFromStore, isLoading, error } = storeToRefs(aeroportStore);
const search = ref("");
const selectedCanton = ref("all");
const sortOrder = ref("name-asc");
const sortOptions = [
  { label: "Nom (A -> Z)", value: "name-asc" },
  { label: "Nom (Z -> A)", value: "name-desc" },
];

// Garde uniquement les aéroports avec code IATA.
const aeroports = computed(() =>
  aeroportsFromStore.value.filter((a) => Boolean(String(a.iata_code ?? "").trim()))
);

const cantonOptions = computed(() => {
  const entries = aeroports.value
    .filter((airport) => airport.canton?.code)
    .map((airport) => ({
      label: `${airport.canton.name} (${airport.canton.code})`,
      value: airport.canton.code,
    }));

  const unique = Array.from(new Map(entries.map((item) => [item.value, item])).values());
  unique.sort((a, b) => a.label.localeCompare(b.label, "fr"));
  return [{ label: "Tous les cantons", value: "all" }, ...unique];
});

const filteredAeroports = computed(() => {
  const q = search.value.trim().toLowerCase();
  const filtered = aeroports.value.filter((airport) => {
      const matchQuery =
        !q ||
        String(airport.name ?? "").toLowerCase().includes(q) ||
        String(airport.iata_code ?? "").toLowerCase().includes(q) ||
        String(airport.icao_code ?? "").toLowerCase().includes(q);
      const matchCanton =
        selectedCanton.value === "all" ||
        String(airport.canton?.code ?? "").toUpperCase() === selectedCanton.value;
      return matchQuery && matchCanton;
    });

  return filtered.toSorted((a, b) => {
      const aName = String(a.name ?? "").toLowerCase();
      const bName = String(b.name ?? "").toLowerCase();
      const baseCompare = aName.localeCompare(bName, "fr");
      return sortOrder.value === "name-desc" ? -baseCompare : baseCompare;
    });
});
</script>

<style scoped>
.filter-panel {
  background: rgba(var(--v-theme-surface), 0.75);
  backdrop-filter: blur(6px);
}
</style>
