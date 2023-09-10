<script setup lang="ts">
import { appWindow } from '@tauri-apps/api/window'
import ConnectionComponent from './components/ConnectionComponent.vue'
import ListingComponent from './components/ListingComponent.vue'
import { infoStore, themeStore } from '@/store/infoStore'
import { watch } from 'vue'

appWindow.setTitle(`BallistaVue - ${infoStore.ballistaInfo.ballista_version}`)
appWindow.setResizable(false)

watch(themeStore.isDark, () => {
  localStorage.theme = themeStore.isDark.value === true ? 'dark' : 'light'

  if (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark')
    localStorage.theme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.theme = 'light'
  }
})
</script>

<template>
  <div class="flex flex-row h-screen w-screen overflow-hidden select-none">
    <div class="w-64 shrink-0 dark:bg-listing-dark">
      <listing-component />
    </div>

    <div class="bg-connection-light dark:bg-connection-dark flex-auto">
      <connection-component />
    </div>
  </div>
</template>
