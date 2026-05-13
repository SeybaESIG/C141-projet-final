import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { getCantonFromAirport } from '@/utils/cantons'

// Évite les appels API en doublon quand plusieurs vues déclenchent un chargement simultanément.
let loadInflight = null

export const useAeroportStore = defineStore('aeroport', {
  state: () => ({
    aeroports: [],
    favorites: [],
    isLoading: true,
    error: null,
  }),

  getters: {
    getAeroportByCode: (state) => {
      return (code) => {
        if (code == null || code === '') return undefined
        const c = String(code).trim().toUpperCase()
        return state.aeroports.find((a) => {
          const iata = a.iata_code?.toUpperCase()
          const icao = a.icao_code?.toUpperCase()
          return iata === c || icao === c
        })
      }
    },

    isFavorite: (state) => {
      return (airport) => {
        const code = String(airport?.iata_code ?? airport?.icao_code ?? '').trim().toUpperCase()
        if (!code) return false
        return state.favorites.includes(code)
      }
    },
  },

  actions: {
    // Charge les favoris depuis le localStorage. Si une erreur survient, réinitialise à une liste vide.
    loadFavorites() {
      try {
        const raw = localStorage.getItem('favorite-airports')
        this.favorites = raw ? JSON.parse(raw) : []
      } catch {
        this.favorites = []
      }
    },

    saveFavorites() {
      localStorage.setItem('favorite-airports', JSON.stringify(this.favorites))
    },

    // Ajoute ou retire un aéroport des favoris.
    toggleFavorite(airport) {
      const code = String(airport?.iata_code ?? airport?.icao_code ?? '').trim().toUpperCase()
      if (!code) return

      if (this.favorites.includes(code)) {
        this.favorites = this.favorites.filter((c) => c !== code)
      } else {
        this.favorites.push(code)
      }
      this.saveFavorites()
    },

    clearFavorites() {
      this.favorites = []
      this.saveFavorites()
    },

    // Charge la liste des aéroports depuis l'API AirLabs.
    async fetchAeroports() {
      this.isLoading = true
      this.error = null

      try {
        const params = {
          country_code: 'CH',
          _fields: 'name,iata_code,icao_code,lat,lng',
        }

        const publicApiKey = import.meta.env.VITE_AIRLABS_API_KEY
        if (publicApiKey) {
          params.api_key = publicApiKey
        }

        const response = await api.get('/airports', { params })

        const data = response.data
        this.aeroports = (data.response || []).map((airport) => ({
          ...airport,
          canton: getCantonFromAirport(airport),
        }))
      } catch (err) {
        this.error = `Impossible de charger les aéroports : ${err.message}`
      } finally {
        this.isLoading = false
      }
    },

    // Initialise le store en chargeant les favoris et la liste des aéroports.
    init() {
      this.loadFavorites()
      return this.ensureLoaded()
    },

    // Garantit que les aéroports sont chargés avant de continuer. Si un chargement est déjà en cours, attend sa fin.
    ensureLoaded() {
      if (this.aeroports.length > 0) {
        this.isLoading = false
        return Promise.resolve()
      }
      if (loadInflight) {
        return loadInflight
      }
      loadInflight = this.fetchAeroports().finally(() => {
        loadInflight = null
      })
      return loadInflight
    },
  },
})
