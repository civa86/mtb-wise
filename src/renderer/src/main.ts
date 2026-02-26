import './style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import KeyFilter from 'primevue/keyfilter'
import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

import { useAppStore } from '@renderer/stores/app'
import { setupI18n } from '@renderer/i18n'
import router from '@renderer/router'
import App from '@renderer/App.vue'

const Noir = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{zinc.50}',
      100: '{zinc.100}',
      200: '{zinc.200}',
      300: '{zinc.300}',
      400: '{zinc.400}',
      500: '{zinc.500}',
      600: '{zinc.600}',
      700: '{zinc.700}',
      800: '{zinc.800}',
      900: '{zinc.900}',
      950: '{zinc.950}'
    },
    colorScheme: {
      light: {
        primary: {
          color: '{zinc.950}',
          inverseColor: '#ffffff',
          hoverColor: '{zinc.900}',
          activeColor: '{zinc.800}'
        },
        highlight: {
          background: '{zinc.950}',
          focusBackground: '{zinc.700}',
          color: '#ffffff',
          focusColor: '#ffffff'
        }
      }
    }
  }
})

const pinia = createPinia()

useAppStore(pinia)
  .boot()
  .then(() => {
    const app = createApp(App)
    app.use(pinia)
    app.use(setupI18n())
    app.use(router)
    app.use(PrimeVue, {
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: '.mtb-wise-dark'
        }
      }
    })
    app.use(ToastService)
    app.directive('keyfilter', KeyFilter)
    app.mount('#app')
  })
