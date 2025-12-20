<template>
  <Menubar :model="items" breakpoint="0px">
    <template #start>
      <router-link :to="{ name: 'statistics' }" class="mr-4">
        <Logo class="size-16" />
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
        <Button
          @click="appStore.fetchData()"
          icon="pi pi-sync"
          severity="secondary"
          variant="text"
          size="large"
          rounded
        />
        <router-link :to="{ name: 'settings' }">
          <Button icon="pi pi-cog" severity="secondary" variant="text" size="large" rounded />
        </router-link>
      </div>
    </template>
  </Menubar>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Menubar, Button } from 'primevue'

import { useAppStore } from '../stores/app'

import Logo from '../components/Logo.vue'

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
