<template>
  <div>
    <ProgressBar :status="usageStatus" :value="usagePercentage"></ProgressBar>
  </div>
  <div class="grid grid-cols-2 gap-4">
    <Fieldset legend="SINCE LAST MAINTENANCE">
      <Time :seconds="secondsSinceLast" />
    </Fieldset>
    <Fieldset legend="BEFORE NEXT MAINTENANCE">
      <Time :seconds="secondsBeforeNext" />
    </Fieldset>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProgressBar from 'primevue/progressbar'
import Fieldset from 'primevue/fieldset'
import { getActivitiesMinDate } from '../utils'
import Time from '../components/Time.vue'

const props = defineProps<{
  activities: Array<any>
  maintenanceHours: number
  lastMaintenance: number | null
}>()

const getLastMaintenance = () =>
  props.lastMaintenance ? new Date(props.lastMaintenance).toISOString() : getActivitiesMinDate(props.activities)

const lastMaintenanceDate = getLastMaintenance()

const maxUsageSeconds = props.maintenanceHours * 60 * 60

const secondsSinceLast = props.activities
  .filter(a => a.start_date >= lastMaintenanceDate)
  .reduce((acc, activity) => acc + activity.moving_time, 0)

const secondsBeforeNext = maxUsageSeconds - secondsSinceLast

const usagePercentage = Math.round((100 * secondsSinceLast) / maxUsageSeconds)

const usageStatus = computed(() => {
  if (usagePercentage >= 95) return 'danger'
  if (usagePercentage >= 75) return 'warn'
  return 'good'
})
</script>

<style lang="css">
/* STATUS GOOD  */
.p-progressbar[status='good'] .p-progressbar-value {
  background-color: var(--color-green-700);
}
.mtb-wise-dark .p-progressbar[status='good'] .p-progressbar-value {
  background-color: var(--color-green-800);
}
.mtb-wise-dark .p-progressbar[status='good'] .p-progressbar-label {
  color: var(--color-zinc-100);
}
/* STATUS WARN  */
.p-progressbar[status='warn'] .p-progressbar-value {
  background-color: var(--color-yellow-500);
}
.p-progressbar[status='warn'] .p-progressbar-label {
  color: var(--color-zinc-700);
}
.mtb-wise-dark .p-progressbar[status='warn'] .p-progressbar-value {
  background-color: var(--color-yellow-600);
}
.mtb-wise-dark .p-progressbar[status='warn'] .p-progressbar-label {
  color: var(--color-zinc-100);
}
/* STATUS DANGER */
.p-progressbar[status='danger'] .p-progressbar-value {
  background-color: var(--color-red-700);
}
.mtb-wise-dark .p-progressbar[status='danger'] .p-progressbar-value {
  background-color: var(--color-red-800);
}
.mtb-wise-dark .p-progressbar[status='danger'] .p-progressbar-label {
  color: var(--color-zinc-100);
}
</style>
