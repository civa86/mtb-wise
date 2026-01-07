<template>
  <div v-if="!appStore.isFetching" class="flex flex-col gap-4">
    <Card v-if="appStore.settings">
      <template #subtitle>
        <span class="uppercase">Suspensions usage</span>
      </template>
      <template #content>
        <Suspensions
          :activities="appStore.activities"
          :maintenance-hours="appStore.settings.maintenanceHours"
          :last-maintenance="appStore.settings.lastMaintenance"
        />
      </template>
    </Card>

    <Card>
      <template #content>
        <Fieldset legend="SUMMARY">
          <div class="pt-3 grid grid-cols-3 gap-8">
            <Time :seconds="appStore.totalTime" label="Total Time" />

            <Distance :distance="appStore.totalDistance" label="Total Kilometers" />

            <Elevation :elevation="appStore.maxElevation" label="Highest +Elevation" />

            <Time :seconds="appStore.avgTime" label="Average Time" />

            <Distance :distance="appStore.avgDistance" label="Average Kilometers" />

            <Elevation :elevation="appStore.avgElevation" label="Average +Elevation" />
          </div>
        </Fieldset>
      </template>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { Card, Fieldset } from 'primevue'
// STORES
import { useAppStore } from '@renderer/stores/app'
// COMPONENTS
import Time from '@renderer/components/Time.vue'
import Distance from '@renderer/components/Distance.vue'
import Elevation from '@renderer/components/Elevation.vue'
import Suspensions from '@renderer/components/Suspensions.vue'

const appStore = useAppStore()
</script>
