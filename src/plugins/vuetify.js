/**
 * plugins/vuetify.js
 *
 * Documentation du framework: https://vuetifyjs.com
 */

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

import { createVuetify } from 'vuetify'

// Définition du thème principal utilisé dans toute l'interface.
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#00B5CC',    // Bleu turquoise 
          secondary: '#97CE4C',  // Vert 
          error: '#E63946',      // Rouge 
          info: '#44CFCB',       // Cyan clair 
          success: '#97CE4C',    // Vert 
        },
      },
    },
  },
})
