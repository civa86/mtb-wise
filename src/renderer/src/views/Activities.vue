<template>
  <div class="grow flex flex-col">
    <Card class="grow" id="activities-container">
      <template #content>
        <ScrollPanel :style="{ height: `${fullHeight}px` }">
          <DataView
            :value="activities"
            :sortOrder="appStore.activitySortDirection === 'desc' ? -1 : 1"
            :sortField="appStore.activitySortField"
          >
            <template #header>
              <div class="flex justify-between items-center">
                <!-- SORTING -->
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
                  <SelectButton v-model="sortField" :options="appStore.activitySortOptions.map(x => x.label)">
                    <template #option="{ option }">
                      <div class="uppercase text-xs">{{ $t(option) }}</div>
                    </template>
                  </SelectButton>
                </div>
                <!-- SEARCH -->
                <div class="pl-12">
                  <IconField>
                    <InputIcon class="pi pi-search" />
                    <InputText :placeholder="$t('SEARCH')" size="small" fluid v-model="search" />
                    <InputIcon v-if="search !== ''" class="pi pi-times cursor-pointer" @click="search = ''" />
                  </IconField>
                </div>
              </div>
            </template>
            <template #list="slotProps">
              <div class="flex flex-col">
                <div v-for="(item, index) in slotProps.items" :key="`activity-${index}`">
                  <div
                    class="p-6 flex flex-col gap-4"
                    :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
                  >
                    <div class="flex items-center justify-between">
                      <div>{{ item.name }}</div>
                      <div class="text-sm dark:text-surface-500">{{ formatActivityDate(item.start_date) }}</div>
                    </div>
                    <div class="grid grid-cols-5 items-end">
                      <!-- DISTANCE -->
                      <div class="flex-col gap-1">
                        <div class="text-xs uppercase text-surface-200 dark:text-surface-500">
                          {{ $t('DISTANCE') }}
                        </div>
                        <div class="flex gap-1 items-baseline">
                          <div>{{ (item.distance / 1000).toFixed(2) }}</div>
                          <div class="text-sm text-orange-700 dark:text-orange-600">Km</div>
                        </div>
                      </div>
                      <!-- TIME -->
                      <div class="flex-col gap-1">
                        <div class="text-xs uppercase text-surface-200 dark:text-surface-500">
                          {{ $t('DURATION') }}
                        </div>
                        <div class="flex gap-1 items-baseline">
                          <div
                            v-for="(time, tj) in secondsToHHMMSS(item.moving_time)"
                            :key="`time-${index}-${tj}`"
                            class="flex items-center justify-center"
                          >
                            <div>{{ time.toString().padStart(2, '0') }}</div>
                            <div v-if="tj !== 2" class="pl-1 text-sm text-orange-700 dark:text-orange-600 text-center">
                              :
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- ELEVTAION -->
                      <div class="flex-col gap-1">
                        <div class="text-xs uppercase text-surface-200 dark:text-surface-500">
                          {{ $t('ELEVATION') }}
                        </div>
                        <div class="flex gap-1 items-baseline">
                          <div>{{ Math.round(item.total_elevation_gain) }}</div>
                          <div class="text-sm text-orange-700 dark:text-orange-600">m</div>
                        </div>
                      </div>
                      <!-- MAX SPEED -->
                      <div class="flex-col gap-1">
                        <div class="text-xs uppercase text-surface-200 dark:text-surface-500">
                          {{ $t('MAX_SPEED') }}
                        </div>
                        <div class="flex gap-1 items-baseline">
                          <div>{{ msToKmh(item.max_speed).toFixed(1) }}</div>
                          <div class="flex gap-0.5">
                            <div class="text-sm text-orange-700 dark:text-orange-600">Km</div>
                            <div class="text-sm">/</div>
                            <div class="text-sm text-orange-700 dark:text-orange-600">h</div>
                          </div>
                        </div>
                      </div>
                      <!-- IMAGES -->
                      <div class="flex gap-4 justify-end">
                        <button
                          v-if="item.total_photo_count > 0"
                          @click="appStore.showPhotos(item.id)"
                          class="cursor-pointer text-orange-700 dark:text-orange-600"
                        >
                          <i class="pi pi-image" />
                        </button>
                        <button
                          @click="appStore.showMap(item.id)"
                          class="cursor-pointer text-orange-700 dark:text-orange-600"
                        >
                          <i class="pi pi-map" />
                        </button>
                      </div>
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
import { Card, ScrollPanel, DataView, SelectButton, IconField, InputIcon, InputText } from 'primevue'
// UTILS
import { formatActivityDate, secondsToHHMMSS, msToKmh } from '@renderer/utils'
// STORES
import { useAppStore } from '@renderer/stores/app'

const appStore = useAppStore()

const fullHeight = ref(0)
const search = ref('')

const sortDirection = computed({
  get: () => (appStore.activitySortDirection ? appStore.activitySortDirection : 'desc'),
  set: () => appStore.toggleActivitySortDirection()
})

const sortField = computed({
  get: () => appStore.selectedActivitySortOption?.label,
  set: evt => appStore.setActivitySortOption(evt || '')
})

const activities = computed(() =>
  appStore.activities.filter(x => search.value === '' || x.name.toLowerCase().includes(search.value.toLowerCase()))
)

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
