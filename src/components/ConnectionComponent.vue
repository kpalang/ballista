<script setup lang="ts">
import { connectionsStore } from '@/store/connectionsStore'
import { Connection } from '@/types/Connection'
import { computed, ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'

const isLaunchLoading = ref(false)

const isValidInput = () => {
  if (connectionsStore.editableComponent.name.trim().length == 0) return false

  return true
}

const saveConnection = async () => {
  if (!isValidInput()) {
    console.log('Invalid input')
    return
  }

  await connectionsStore.saveConnection(connectionsStore.editableComponent, true)
}

const deleteConnection = async () => {
  const confirmed = true
  await connectionsStore.deleteConnection(connectionsStore.editableComponent)
}

const launchConnection = async () => {
  isLaunchLoading.value = true

  try {
    let resp: string = await invoke('launch', { id: connectionsStore.editableComponent.id })
    let result: any = JSON.parse(resp)
    if (result.code == 1) {
      // setCert(result.cert);
      console.log(result.cert)
    }
    isLaunchLoading.value = false
    if (result.code == -1) {
      console.log('opening notif')
      // openNotification('topRight', result.msg);
    }
  } catch (e) {
    isLaunchLoading.value = false
  }

  isLaunchLoading.value = false
}

const distinctGroups = computed(() => [
  ...new Set(connectionsStore.allConnections.map((connection: Connection) => connection.group))
])
</script>

<template>
  <form class="py-10 px-5 grid grid-cols-2 gap-4 dark:text-white" @submit.prevent>
    <input
      class="col-span-2 h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
      type="text"
      v-model="connectionsStore.editableComponent.name"
      placeholder="Connection's name e.g Acme Test Instance"
    />
    <input
      class="col-span-2 h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
      type="text"
      v-model="connectionsStore.editableComponent.address"
      placeholder="Mirth Connect URL e.g https://localhost:8443"
    />
    <input
      class="col-span-1 h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
      type="text"
      v-model="connectionsStore.editableComponent.username"
      placeholder="Username e.g admin"
    />
    <input
      class="col-span-1 h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
      type="password"
      v-model="connectionsStore.editableComponent.password"
      placeholder="Password. Skip, if sensitive"
    />
    <input
      class="col-span-2 h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
      type="text"
      v-model="connectionsStore.editableComponent.javaHome"
      placeholder="Path to Java Home directory"
    />
    <input
      class="col-span-2 h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
      type="text"
      v-model="connectionsStore.editableComponent.heapSize"
      placeholder="e.g. 512m or 2g"
    />

    <div>
      <p class="inline">Verify certificates?</p>
      <input
        class="col-span-1 shadow-lg rounded-md ml-2 dark:bg-input-dark"
        type="checkbox"
        v-model="connectionsStore.editableComponent.verify"
      />
    </div>

    <input
      class="col-span-1 h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
      type="search"
      list="existing-connection-groups"
      v-model="connectionsStore.editableComponent.group"
      placeholder="Group"
    />
    <datalist id="existing-connection-groups">
      <option v-for="group in distinctGroups" :key="group" :value="group">{{ group }}</option>
    </datalist>

    <button
      class="col-span-2 border border-black py-1 bg-blue-500 text-white font-bold"
      @click="saveConnection"
    >
      Save
    </button>
    <button
      class="col-span-2 border border-black py-1 bg-green-700 text-white font-bold"
      @click="launchConnection"
    >
      Open
    </button>
    <button
      class="col-span-2 border border-black py-1 bg-red-700 text-white font-bold"
      @click="deleteConnection"
    >
      Delete
    </button>
  </form>
</template>
