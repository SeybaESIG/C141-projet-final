<template>
  <v-card
    class="airport-card h-100 d-flex flex-column airport-card--clickable"
    rounded="xl"
    elevation="2"
    role="button"
    tabindex="0"
    @click="goToDetail"
    @keydown.enter.prevent="goToDetail"
    @keydown.space.prevent="goToDetail"
  >
    <div class="airport-card__media">
      <v-img
        v-if="cantonFlagSrc"
        :src="cantonFlagSrc"
        :alt="`Drapeau du canton ${aeroport.canton?.name || ''}`"
        class="airport-card__flag"
        contain
      />
      <div v-else class="airport-card__flag airport-card__flag--fallback">
        <v-icon size="40" icon="mdi-airplane" />
      </div>

      <v-chip
        v-if="aeroport.canton?.code"
        class="airport-card__chip"
        color="primary"
        size="small"
        variant="elevated"
      >
        {{ aeroport.canton.code }}
      </v-chip>
    </div>

    <v-card-item class="pb-2 airport-card__header">
      <v-card-title class="airport-card__title">{{ aeroport.name }}</v-card-title>
      <v-card-subtitle class="airport-card__subtitle">
        {{ aeroport.canton?.name || "Canton inconnu" }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="pt-0">
      <div class="d-flex ga-2 flex-wrap airport-card__meta">
        <v-chip size="small" variant="tonal" color="info">
          IATA: {{ aeroport.iata_code || "—" }}
        </v-chip>
        <v-chip size="small" variant="tonal">
          ICAO: {{ aeroport.icao_code || "—" }}
        </v-chip>
      </div>
    </v-card-text>

    <v-spacer />

    <v-card-actions class="pt-0 airport-card__actions">
      <v-btn
        variant="text"
        color="error"
        :prepend-icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
        @click.stop.prevent="onToggleFavorite"
      >
        {{ isFavorite ? "Retirer des favoris" : "Ajouter aux favoris" }}
      </v-btn>
      <v-btn variant="tonal" color="primary" class="airport-card__view-btn">
        Voir
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { getCantonFlagSrc } from "@/utils/cantons";

const router = useRouter();

// Props attendus par le composant AeroportCard
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

//  Récupère le code IATA ou ICAO de l'aeroport et encode l'URL pour le routage.
const detailRoute = computed(() => {
  const code = String(props.aeroport.iata_code ?? "").trim();
  return code ? `/aeroport/${encodeURIComponent(code)}` : "/";
});

// Navigue vers la page de détail de l'aeroport.
function goToDetail() {
  const path = detailRoute.value;
  if (path && path !== "/") {
    router.push(path);
  }
}

const cantonFlagSrc = computed(() => {
  return getCantonFlagSrc(props.aeroport.canton?.code);
});

function onToggleFavorite(event) {
  // Bloque la propagation de l'événement pour éviter des redirections inattendues. 
  event?.preventDefault();
  event?.stopPropagation();
  emit("toggle-favorite", props.aeroport);
}
</script>

<style scoped>
.airport-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.airport-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--v-theme-primary), 0.4);
  box-shadow: 0 14px 32px rgba(0, 0, 0, 0.28) !important;
}

.airport-card--clickable {
  cursor: pointer;
}

.airport-card--clickable:focus-visible {
  outline: 2px solid rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.airport-card__media {
  position: relative;
  height: 160px;
  background-color: rgb(var(--v-theme-surface));
}

.airport-card__flag {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.airport-card__flag--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.72);
}

.airport-card__chip {
  position: absolute;
  top: 10px;
  right: 10px;
  font-weight: 700;
}

.airport-card__title {
  line-height: 1.3;
  font-size: 1.05rem;
  text-align: center;
}

.airport-card__subtitle {
  opacity: 0.9;
  text-align: center;
}

.airport-card__header :deep(.v-card-item__content) {
  text-align: center;
}

.airport-card__meta {
  justify-content: center;
}

.airport-card__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  column-gap: 8px;
  row-gap: 8px;
}

.airport-card__view-btn {
  min-width: 76px;
}
</style>
