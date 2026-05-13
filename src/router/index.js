/**
 * Configuration du routeur
 *
 * Routes automatiques depuis `./src/pages/*.vue`
 */
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// Recharge la page une fois pour forcer le chargement des bons fichiers.
router.onError((err, to) => {
    if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
        if (!localStorage.getItem('vuetify:dynamic-reload')) {
            console.log('Reloading page to fix dynamic import error')
            localStorage.setItem('vuetify:dynamic-reload', 'true')
            location.assign(to.fullPath)
        } else {
            console.error('Dynamic import error, reloading page did not fix it', err)
        }
    } else {
        console.error(err)
    }
})

// Efface le marqueur de rechargement une fois que le routeur est prêt.
router.isReady().then(() => {
    localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
