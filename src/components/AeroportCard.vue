<template>
  <v-card class="h-100" hover :to="detailRoute">
    <v-card-title>{{ aeroport.name }}</v-card-title>
    <v-card-subtitle>
      <span v-if="aeroport.iata_code">IATA: {{ aeroport.iata_code }}</span>
      <span v-else>IATA: —</span>
      <span class="mx-2">|</span>
      <span v-if="aeroport.icao_code">ICAO: {{ aeroport.icao_code }}</span>
      <span v-else>ICAO: —</span>
    </v-card-subtitle>

    <v-card-text v-if="aeroport.canton" class="pt-2">
      <div>
        <div class="mb-2">Canton: {{ aeroport.canton.name }} ({{ aeroport.canton.code }})</div>
        <v-img
          v-if="cantonFlagSrc"
          :src="cantonFlagSrc"
          :alt="`Drapeau du canton ${aeroport.canton.name}`"
          class="canton-flag-image"
          contain
        />
      </div>
    </v-card-text>

    <v-card-actions @click.stop @mousedown.stop>
      <v-btn
        variant="text"
        color="error"
        prepend-icon="mdi-heart"
        @click.stop.prevent="onToggleFavorite"
      >
        {{ isFavorite ? "Retirer des favoris" : "Ajouter aux favoris" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { getCantonFlagSrc } from "@/utils/cantons";

const props = defineProps({
  aeroport: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["toggle-favorite"]);

const detailRoute = computed(() => {
  const code = String(props.aeroport.iata_code ?? "").trim();
  return code ? `/aeroport/${encodeURIComponent(code)}` : "/";
});

const cantonFlagSrc = computed(() => {
  return getCantonFlagSrc(props.aeroport.canton?.code);
});

function onToggleFavorite(event) {
  event?.preventDefault();
  event?.stopPropagation();
  emit("toggle-favorite", props.aeroport);
}
</script>

<style scoped>
.canton-flag-image {
  width: 100%;
  max-width: 220px;
  height: 140px;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}
</style>
