<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import ConnectionComponent from './components/ConnectionComponent.vue'
import ListingComponent from './components/ListingComponent.vue'
import { infoStore } from '@/store/infoStore'

appWindow.setTitle(`BallistaVue - ${infoStore.ballistaInfo.ballista_version}`)
appWindow.setResizable(false)

const handleDarkMode = () => {
  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

handleDarkMode()
</script>

<template>
  <div class="flex flex-row h-screen w-screen overflow-hidden">
    <div class="w-64 shrink-0 dark:bg-listing-dark">
      <listing-component />
    </div>

    <div class="bg-connection-light dark:bg-connection-dark flex-auto">
      <connection-component />
    </div>
  </div>
</template>
