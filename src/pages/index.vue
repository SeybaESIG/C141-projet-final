<template>
  <v-container>
    <h1 class="text-h4 my-4">Liste des aéroports</h1>

    <!-- Chargement (skeleton) -->
    <v-row v-if="loading">
      <v-col v-for="n in 8" :key="n" cols="12" sm="6" md="4" lg="3">
        <v-skeleton-loader type="image, heading, text" />
      </v-col>
    </v-row>

    <!-- Erreur -->
    <v-alert v-else-if="error" type="error" class="my-4">
      {{ error }}
    </v-alert>

    <!-- Liste des aéroports -->
    <v-row v-else>
      <v-col
          v-for="airport in airports"
          :key="airport.icao_code || airport.iata_code || airport.name"
          cols="12"
          sm="6"
          md="4"
          lg="3"
      >
        <v-card class="h-100" hover>
          <v-card-title>{{ airport.name }}</v-card-title>
          <v-card-text>
            <div v-if="airport.iata_code">IATA : {{ airport.iata_code }}</div>
            <div v-if="airport.icao_code">ICAO : {{ airport.icao_code }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// État réactif
const characters = ref([])
const loading = ref(true)
const error = ref(null)
const airports = ref([])

/**
 * Retourne la couleur du chip selon le statut du personnage.
 */
function statusColor(status) {
  const colors = { Alive: 'green', Dead: 'red', unknown: 'grey' }
  return colors[status] || 'grey'
}

// Chargement des données au montage du composant
onMounted(async () => {
  try {
    const apiKey = import.meta.env.VITE_AIRLABS_API_KEY

    // garde d'exécution : échouer rapidement si la variable VITE_ n'est pas définie
    if (!apiKey) {
      error.value = 'Clé API manquante : définissez VITE_AIRLABS_API_KEY dans votre .env'
      loading.value = false
      console.warn('VITE_AIRLABS_API_KEY est manquant')
      return
    }

    const url = `https://airlabs.co/api/v9/airports?country_code=CH&_fields=name,iata_code,icao_code&api_key=${apiKey}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`)
    }

    const data = await response.json()
    // AirLabs renvoie les données dans le tableau `response` (conserver le comportement existant)
    airports.value = data.response || []
  } catch (err) {
    error.value = `Impossible de charger les aéroports : ${err.message}`
  } finally {
    loading.value = false
  }
})
</script>
