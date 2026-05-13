// Plugins Vite
import VueRouter from 'unplugin-vue-router/vite'
import Components from 'unplugin-vue-components/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import ViteFonts from 'unplugin-fonts/vite'

// Utilitaires
import { copyFileSync } from 'node:fs'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Fonction pour copier index.html en 404.html pour GitHub Pages
function githubPagesSpaFallback () {
  return {
    name: 'github-pages-spa-fallback',
    writeBundle (options) {
      const dir = options.dir
      if (!dir) return
      const indexHtml = join(dir, 'index.html')
      copyFileSync(indexHtml, join(dir, '404.html'))
    },
  }
}

// Configuration principale Vite
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    githubPagesSpaFallback(),
    // Routage basé sur les fichiers.
    VueRouter(),
    Vue({
      template: { transformAssetUrls }
    }),
    // Intégration Vuetify + auto-import des composants.
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [{
          name: 'Roboto',
          styles: 'wght@100;300;400;500;700;900',
        }],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ],
  },
  server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      sass: {
        api: 'modern-compiler',
      },
    },
  },
})
