<template>
  <div v-if="authStore.isAuthorizing" class="h-full p-4 bg-primary-100">
    <div class="h-full flex flex-col items-center justify-center">
      <div class="w-full p-32 text-primary-500 flex flex-col items-center">
        <Loader class="animate-pulse duration-300" />
        <div class="text-primary-900 text-2xl mt-4 animate-pulse">Authorizing</div>
      </div>
    </div>
  </div>

  <div v-else class="h-full p-4 bg-primary-100">
    <div v-if="appStore.error" class="h-full flex flex-col items-center justify-center">
      <GeneralError @reload="appStore.reload()" />
    </div>
    <div class="h-full" v-else>
      <Header class="mb-4" />
      <router-view />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from './stores/auth'
import { useAppStore } from './stores/app'

import Loader from './components/Loader.vue'
import GeneralError from './components/GeneralError.vue'
import Header from './components/Header.vue'

const authStore = useAuthStore()
const appStore = useAppStore()
</script>
