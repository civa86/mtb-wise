<template>
  <Carousel
    v-if="!appStore.isFetching && photos.length > 0"
    :value="photos"
    :numVisible="1"
    :numScroll="1"
    orientation="horizontal"
    :showIndicators="false"
    :circular="true"
  >
    <template #item="{ data, index }">
      <div class="flex flex-col items-center justify-center">
        <Image :src="data.url" :alt="`photo-${index}`" class="h-[calc(100vh-2rem)]" preview />
      </div>
    </template>
  </Carousel>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Carousel, Image } from 'primevue'
import { useAppStore } from '@renderer/stores/app'
import { Activity, ActivityPhotos } from '@types'

const appStore = useAppStore()
const route = useRoute()

const photos = ref<Array<ActivityPhotos>>([])
const activity = ref<Activity | null>(null)

document.title = ''

onMounted(async () => {
  const data = await Promise.all([
    appStore.fetchActivityPhotos(route.params.id as string),
    appStore.fetchActivity(route.params.id as string)
  ])
  photos.value = data[0]
  activity.value = data[1]
  if (activity.value) document.title = activity.value.name
})
</script>
