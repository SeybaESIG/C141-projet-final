<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" class="mb-4" @click="$router.back()">
      Retour a la liste
    </v-btn>

    <v-row v-if="isLoading">
      <v-col cols="12" md="8" class="mx-auto">
        <v-skeleton-loader type="article, image, text@3" />
      </v-col>
    </v-row>

    <v-alert
        v-else-if="error"
        type="error"
        variant="tonal"
        class="mb-4"
    >
      {{ error }}
    </v-alert>

    <v-alert
        v-else-if="showNotFound"
        type="error"
        variant="tonal"
        class="mb-4"
    >
      Aucun aéroport ne correspond à ce code.
    </v-alert>

    <v-card v-else-if="aeroport" max-width="980" class="mx-auto aeroport-detail-card">
      <v-card-item class="hero">
        <template #prepend>
          <v-avatar color="primary" size="52">
            <v-icon icon="mdi-airplane" />
          </v-avatar>
        </template>
        <v-card-title class="text-h5 text-md-h4">
          {{ aeroport.name }}
        </v-card-title>
        <v-card-subtitle>
          Fiche detaillee de l'aeroport
        </v-card-subtitle>
      </v-card-item>

      <v-divider />

      <v-card-text class="pa-4 pa-md-6">
        <v-row>
          <v-col cols="12" md="6">
            <div class="section-title">Informations</div>
            <div class="d-flex flex-wrap ga-2 mt-2">
              <v-chip color="primary" variant="tonal">
                IATA: {{ aeroport.iata_code || "—" }}
              </v-chip>
              <v-chip color="secondary" variant="tonal">
                ICAO: {{ aeroport.icao_code || "—" }}
              </v-chip>
            </div>

            <v-card variant="tonal" class="mt-4 info-box">
              <v-card-text>
                <div class="text-subtitle-2 mb-1">Coordonnees</div>
                <div><strong>Latitude :</strong> {{ displayCoord(aeroport.lat) }}</div>
                <div><strong>Longitude :</strong> {{ displayCoord(aeroport.lng) }}</div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <div class="section-title">Canton</div>
            <v-card variant="outlined" class="mt-2 canton-box">
              <v-card-text v-if="aeroport.canton">
                <div class="mb-2 text-subtitle-1">
                  {{ aeroport.canton.name }} ({{ aeroport.canton.code }})
                </div>
                <v-img
                  v-if="cantonFlagSrc"
                  :src="cantonFlagSrc"
                  :alt="`Drapeau du canton ${aeroport.canton.name}`"
                  class="canton-flag-image"
                  contain
                />
              </v-card-text>
              <v-card-text v-else>
                <v-alert type="info" variant="tonal" density="comfortable">
                  Canton non disponible pour cet aeroport.
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12">
            <div class="section-title mt-2">Localisation sur la carte</div>
            <v-card variant="outlined" class="mt-2 map-box">
              <iframe
                v-if="googleMapsEmbedUrl"
                class="airport-map"
                :src="googleMapsEmbedUrl"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                allowfullscreen
              />
              <v-card-text v-else>
                <v-alert type="info" variant="tonal">
                  Localisation indisponible pour cet aeroport.
                </v-alert>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAeroportStore } from '@/stores/aeroportStore'
import { getCantonFlagSrc } from '@/utils/cantons'

const route = useRoute()
const aeroportStore = useAeroportStore()
const { isLoading, error } = storeToRefs(aeroportStore)

const routeCode = computed(() => {
  const raw = route.params.id
  if (raw == null || raw === '') return ''
  return decodeURIComponent(String(raw)).trim()
})

const aeroport = computed(() => {
  if (!routeCode.value) return undefined
  return aeroportStore.getAeroportByCode(routeCode.value)
})

const showNotFound = computed(() => {
  if (isLoading.value || error.value) return false
  if (!routeCode.value) return true
  return !aeroport.value
})
const cantonFlagSrc = computed(() => getCantonFlagSrc(aeroport.value?.canton?.code))

const googleMapsEmbedUrl = computed(() => {
  const lat = Number(aeroport.value?.lat)
  const lng = Number(aeroport.value?.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return ""
  return `https://www.google.com/maps?q=${lat},${lng}&z=12&output=embed`
})

function displayCoord(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return "—"
  return n.toFixed(5)
}
</script>

<style scoped>
.aeroport-detail-card {
  border-radius: 16px;
}

.hero {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.12) 0%,
    rgba(var(--v-theme-secondary), 0.08) 100%
  );
}

.section-title {
  font-size: 1.05rem;
  font-weight: 700;
}

.info-box,
.canton-box,
.map-box {
  border-radius: 12px;
}

.canton-flag-image {
  width: 100%;
  max-width: 420px;
  height: 230px;
  background-color: rgb(var(--v-theme-surface));
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 8px;
}

.airport-map {
  width: 100%;
  height: 380px;
  border: 0;
  border-radius: 12px;
}
</style>
