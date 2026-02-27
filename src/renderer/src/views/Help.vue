<template>
  <div class="flex flex-col gap-4">
    <Card class="w-full">
      <template #content>
        <div class="text-2xl mb-4">
          {{ $t('HELP_WELCOME_TO') }} <b class="text-orange-700 dark:text-orange-600">MTBikeWise</b>
        </div>
        <p class="my-2">{{ $t('HELP_INTRO') }}</p>
        <ul class="mt-4 list-inside list-decimal marker:text-gray-400">
          <li class="mb-2">
            {{ $t('HELP_STEP1_PREFIX') }}
            <a class="text-orange-500 underline" href="https://www.strava.com/register" target="_blank">{{
              $t('HELP_SIGN_UP')
            }}</a>
            {{ $t('HELP_STEP1_SUFFIX') }}
          </li>
          <li class="mb-2">
            {{ $t('HELP_STEP2_PREFIX') }}
            <a class="text-orange-500 underline" href="https://www.strava.com/settings/api" target="_blank">{{
              $t('HELP_API_PAGE')
            }}</a>
            {{ $t('HELP_STEP2_SUFFIX') }}
          </li>
          <li>
            {{ $t('HELP_STEP3') }}
          </li>
        </ul>
      </template>
    </Card>
    <Card class="w-full">
      <template #content>
        <p>
          {{ $t('HELP_STEP3_ITEM1') }}
          <img class="block mt-2" :src="createImage" />
        </p>
      </template>
    </Card>
    <Card class="w-full">
      <template #content>
        <p>
          {{ $t('HELP_STEP3_ITEM2_PREFIX') }} <i class="text-orange-500">{{ $t('CLIENT_ID') }}</i>
          {{ $t('HELP_STEP3_ITEM2_MIDDLE') }}
          <i class="text-orange-500">{{ $t('STRAVA_CLIENT_SECRET') }}</i>
          {{ $t('HELP_STEP3_ITEM2_SUFFIX') }}
          <img class="block mt-2" :src="tokenImage" />
        </p>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import createImage from '@renderer/assets/strava/create.png'
import tokenImage from '@renderer/assets/strava/token.png'
import { Card } from 'primevue'
</script>
