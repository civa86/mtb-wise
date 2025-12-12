<template>
  <Menubar :model="items" breakpoint="0px">
    <template #start>
      <router-link :to="{ name: 'statistics' }" class="mr-4">
        <img :src="appStore.darkMode ? logoDark : logo" alt="logo" class="h-10" />
      </router-link>
    </template>
    <template #item="{ item }">
      <router-link v-if="route.name !== item.routeName" :to="{ name: item.routeName }">
        <div class="flex items-center gap-2 px-4 py-2">
          <span :class="item.icon" />
          <span>{{ item.label }}</span>
        </div>
      </router-link>
      <div v-else>
        <Button severity="primary" :icon="item.icon" :label="item.label as string" />
      </div>
    </template>

    <template #end>
      <div class="flex items-center gap-2">
        <router-link :to="{ name: 'settings' }">
          <Button
            icon="pi pi-cog"
            :severity="route.name === 'settings' ? 'primary' : 'secondary'"
            :variant="route.name === 'settings' ? '' : 'text'"
            size="large"
            rounded
          />
        </router-link>
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

import logo from '../assets/logo.png'
import logoDark from '../assets/logo-dark.png'

import { useAppStore } from '../stores/app'

const route = useRoute()

const appStore = useAppStore()

const items = ref([
  {
    label: 'Statistics',
    icon: 'pi pi-chart-bar',
    routeName: 'statistics'
  },
  {
    label: 'Activities',
    icon: 'pi pi-list',
    routeName: 'activities'
  }
])
</script>
