<template>
  <div class="grow flex flex-col">
    <Card class="grow" id="activities-container">
      <template #content>
        <ScrollPanel :style="{ height: `${fullHeight}px` }">
          <DataView
            :value="appStore.activities"
            :sortOrder="appStore.activitySortDirection === 'desc' ? -1 : 1"
            :sortField="appStore.activitySortField"
          >
            <template #header>
              <div class="flex gap-2">
                <SelectButton v-model="sortDirection" :options="['desc', 'asc']">
                  <template #option="{ option }">
                    <div class="flex gap-2 items-center">
                      <i
                        :class="{
                          'pi pi-sort-amount-up-alt': option === 'asc',
                          'pi pi-sort-amount-down': option === 'desc'
                        }"
                      />
                    </div>
                  </template>
                </SelectButton>
                <Select v-model="sortField" :options="appStore.activitySortOptions" optionLabel="label" />
              </div>
            </template>
            <template #list="slotProps">
              <div class="flex flex-col">
                <div v-for="(item, index) in slotProps.items" :key="`activity-${index}`">
                  <div
                    class="p-6 gap-4 flex items-center"
                    :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
                  >
                    <div class="flex flex-col gap-1">
                      <div>{{ item.name }}</div>
                      <div class="text-sm dark:text-surface-500">{{ item.start_date_local }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </DataView>
        </ScrollPanel>
      </template>
    </Card>
  </div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import Card from 'primevue/card'
import ScrollPanel from 'primevue/scrollpanel'
import DataView from 'primevue/dataview'
import SelectButton from 'primevue/selectbutton'
import Select from 'primevue/select'

import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const fullHeight = ref(0)
const sortDirection = computed({
  get: () => (appStore.activitySortDirection ? appStore.activitySortDirection : 'desc'),
  set: () => appStore.toggleActivitySortDirection()
})
const sortField = computed({
  get: () => appStore.selectedActivitySortOption,
  set: (evt: { label: string; value: string }) => (appStore.activitySortField = evt.value)
})

const calculateAvailableHeigth = () => {
  const elem = document.querySelector('#activities-container') as HTMLElement
  const elemBody = document.querySelector('.p-card-body') as HTMLElement
  const elemPadding = parseInt(getComputedStyle(elemBody).padding, 10) * 2
  fullHeight.value = elem.offsetHeight - elemPadding
}

onMounted(() => {
  calculateAvailableHeigth()
  window.addEventListener('resize', calculateAvailableHeigth)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', calculateAvailableHeigth)
})
</script>
