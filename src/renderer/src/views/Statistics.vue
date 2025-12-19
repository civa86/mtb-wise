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
          <div class="grid grid-cols-3 gap-8">
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
import Card from 'primevue/card'
import Fieldset from 'primevue/fieldset'

import { useAppStore } from '../stores/app'

import Time from '../components/Time.vue'
import Distance from '../components/Distance.vue'
import Elevation from '../components/Elevation.vue'
import Suspensions from '../components/Suspensions.vue'

const appStore = useAppStore()
</script>
