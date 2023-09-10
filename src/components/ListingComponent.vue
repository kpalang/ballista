<script setup lang="ts">
import { computed, ref } from 'vue'
import { connectionsStore } from '@/store/connectionsStore'
import { getEmptyConnection, searchText } from '@/types/Connection'
import type { Connection } from '@/types/Connection'
import { Icon } from '@iconify/vue'
import { themeStore } from '@/store/infoStore'

const searchPhrase = ref('')
const iconName = computed(() =>
  themeStore.isDark.value ? 'akar-icons:sun-fill' : 'akar-icons:moon-fill'
)
const themeTargetText = computed(() => (themeStore.isDark.value ? 'light' : 'dark'))
const connectionsMap = computed(() => {
  let clonedConnections = [...connectionsStore.allConnections] as Connection[]
  let groupedConnections = {} as any

  clonedConnections.forEach((connection: Connection) => {
    if (!searchText(searchPhrase.value, connection)) return

    if (!(connection.group in groupedConnections)) {
      groupedConnections[connection.group] = [] as Connection[]
    }

    (groupedConnections[connection.group] as Connection[]).push(connection)
  })

  return groupedConnections
})

const startDrag = (event: DragEvent, connection: Connection) => {
  if (!event || !event.dataTransfer) throw Error('DragEvent is null')

  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('connectionID', connection.id)
}

const onDrop = (event: DragEvent, groupName: string) => {
  if (!event || !event.dataTransfer) throw Error('DragEvent is null')

  const connectionID = event.dataTransfer.getData('connectionID')
  const connection = connectionsStore.allConnections.find(
    (connection: Connection) => connection.id == connectionID
  )

  if (connection === undefined) {
    throw Error('Something went poopy')
  }

  connection.group = groupName
  connectionsStore.saveConnection(connection, false)
}

const handleNewConnectionButton = () => {
  connectionsStore.editableComponent = getEmptyConnection()
}


</script>

<template>
  <div class="dark:text-white flex flex-col justify-between h-full">
    <!-- Top end-->
    <div>
      <input
        type="search"
        class="w-full px-2 py-1 shadow-lg dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
        v-model="searchPhrase"
        placeholder="Search"
      />

      <div class="mx-2">
        <ul
          class="py-2 my-2"
          v-for="[groupName, group] in Object.entries(connectionsMap)"
          :key="groupName"
          @drop="onDrop($event, groupName)"
          @dragenter.prevent
          @dragover.prevent
        >
          <li>{{ groupName }}</li>
          <li
            class="ml-2 hover:bg-blue-400 hover:cursor-pointer border-l-2 pl-2 border-transparent"
            :class="{ 'border-red-400': connection.id === connectionsStore.selectedConnection.id, 'border-transparent': connection.id !== connectionsStore.selectedConnection.id }"
            v-for="connection in group"
            :key="connection.id"
            draggable="true"
            @dragstart="startDrag($event, connection)"
            @click="connectionsStore.setSelectedConnection(connection)"
          >
            {{ connection.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="border-t border-gray-400 h-32 flex flex-col justify-around">
      <button
        class="flex flex-row justify-between hover:shadow-lg px-2"
        @click="handleNewConnectionButton()"
      >
        <span>New connection</span>
        <icon class="text-xl h-full mx-1 dark:text-yellow-400" icon="akar-icons:plus" />
      </button>

      <button class="hover:shadow-lg px-2">
        <label class="w-full flex flex-row justify-between hover:cursor-pointer">
          <span>Import</span>
          <icon
            class="inline text-xl h-full mx-1 dark:text-yellow-400"
            icon="akar-icons:share-box"
          />
          <input class="hidden" type="file" />
        </label>
      </button>

      <button
        class="flex flex-row justify-between hover:shadow-lg px-2"
        @click="themeStore.isDark.value = !themeStore.isDark.value"
      >
        <span>Set theme to: {{ themeTargetText }}</span>
        <icon class="text-xl h-full mx-1 dark:text-yellow-400" :icon="iconName" />
      </button>
    </div>
  </div>
</template>
