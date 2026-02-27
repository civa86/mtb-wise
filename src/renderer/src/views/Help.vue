<template>
  <div class="w-full">
    <div class="text-2xl text-center mb-4">
      Welcome to <b class="text-orange-700 dark:text-orange-600">MTBikeWise</b>
    </div>
    <p class="text-center my-2">To start using the application you need to get an API key from Strava.</p>
    <ul class="mt-4 list-inside list-decimal marker:text-gray-400">
      <li class="mb-2">
        If you have not already,
        <a class="text-orange-500 underline" href="https://www.strava.com/register" target="_blank">Sign Up</a> and for
        a Strava account.
      </li>
      <li class="mb-2">
        After you are logged in, go to
        <a class="text-orange-500 underline" href="https://www.strava.com/settings/api" target="_blank">API Page</a> and
        create an app.
      </li>
      <li>
        You should see the “My API Application” page now.
        <ul class="mt-1 list-inside list-[upper-roman] indent-5">
          <li class="mb-4">
            Create a new Application
            <img class="block ml-9 mt-2" :src="createImage" />
          </li>
          <li>
            Copy and save the <i class="text-orange-500">Client ID</i> and
            <i class="text-orange-500">Client Secret</i> in the Settings page
            <img class="block ml-9 mt-2" :src="tokenImage" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import createImage from '@renderer/assets/strava/create.png'
import tokenImage from '@renderer/assets/strava/token.png'
</script>
