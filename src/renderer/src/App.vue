<template>
  <div v-if="authStore.isAuthorizing" class="h-full p-4 bg-primary-100 dark:bg-primary-700">
    <div class="h-full flex flex-col items-center justify-center">
      <div class="w-full p-32 text-primary-500 flex flex-col items-center">
        <Loader class="animate-pulse duration-300" />
        <div class="text-primary-900 text-2xl mt-4 animate-pulse">Authorizing</div>
      </div>
    </div>
  </div>

  <div v-else class="min-h-full p-4 flex flex-col bg-primary-100 dark:bg-primary-700">
    <div v-if="appStore.error" class="h-full flex flex-col items-center justify-center">
      <GeneralError @reload="appStore.reload()" />
    </div>
    <div class="grow flex flex-col" v-else>
      <Header class="mb-4" v-if="route.name !== 'settings'" />
      <router-view />
    </div>
    <div v-if="appStore.isFetching" class="fixed top-0 left-0 w-full h-full flex items-center justify-center">
      <ProgressSpinner />
    </div>
    <Toast />
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import Toast from 'primevue/toast'

import { useAuthStore } from './stores/auth'
import { useAppStore } from './stores/app'

import Loader from './components/Loader.vue'
import GeneralError from './components/GeneralError.vue'
import Header from './components/Header.vue'

const authStore = useAuthStore()
const appStore = useAppStore()

const route = useRoute()
</script>
