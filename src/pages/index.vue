<template>
  <v-container>
    <h1 class="text-h4 my-4">Liste des aéroports</h1>

    <v-row class="mb-4">
      <v-col cols="12" md="5">
        <v-text-field
          v-model="search"
          label="Rechercher un aéroport"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-magnify"
          clearable
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

    <v-row v-if="isLoading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <v-row v-else>
      <v-col
          v-for="airport in filteredAeroports"
          :key="airport.icao_code || airport.iata_code || airport.name"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <aeroport-card
          :aeroport="airport"
          :is-favorite="aeroportStore.isFavorite(airport)"
          @toggle-favorite="aeroportStore.toggleFavorite"
        />
      </v-col>
    </v-row>

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
