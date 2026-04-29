import { defineStore } from 'pinia'
import api from '@/plugins/axios'
import { getCantonFromAirport } from '@/utils/cantons'

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

    async fetchAeroports() {
      const apiKey = import.meta.env.VITE_AIRLABS_API_KEY

      if (!apiKey) {
        this.error = 'Clé API manquante'
        this.isLoading = false
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const response = await api.get('/airports', {
          params: {
            country_code: 'CH',
            _fields: 'name,iata_code,icao_code,lat,lng',
            api_key: apiKey,
          },
        })

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

    init() {
      this.loadFavorites()
      return this.ensureLoaded()
    },

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
