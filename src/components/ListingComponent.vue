<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { connectionsStore } from '@/store/connectionsStore'
import { searchText } from '@/types/Connection'
import type { Connection } from '@/types/Connection'

const searchPhrase = ref('')

const connectionsMap = computed(() => {
  let clonedConnections = [...connectionsStore.allConnections] as Connection[]
  let groupedConnections = {}

  clonedConnections.forEach((connection: Connection) => {
    if (!searchText(searchPhrase.value, connection)) return

    if (!(connection.group in groupedConnections)) {
      groupedConnections[connection.group] = []
    }

    (groupedConnections[connection.group] as Connection[]).push(connection)
  })

  return groupedConnections
})

const startDrag = (event: DragEvent, connection: Connection) => {
  event.dataTransfer.dropEffect = 'move'
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('connectionID', connection.id)
}

const onDrop = (event: DragEvent, groupName: string) => {
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

const handleClick = () => {}
</script>

<template>
  <div class="dark:text-white">
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
          class="ml-5 hover:bg-blue-400 hover:cursor-pointer border-l-2 border-transparent"
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

    <div>
      <label class="mx-2 border border-black p-1 rounded-sm shadow-lg hover:cursor-pointer">
        Import
        <input class="hidden" type="file" />
      </label>
    </div>
  </div>
</template>
