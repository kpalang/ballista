<script setup lang="ts">
import { connectionsStore, certificateStore } from '@/store/connectionsStore'
import type { Connection } from '@/types/Connection'
import { computed, ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import ConfirmCancelDialog from '@/components/dialog/ConfirmCancelDialog.vue'
import {Icon} from "@iconify/vue";
import TrustClientCertificateDialog from "@/components/dialog/TrustClientCertificateDialog.vue";

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

const launchConnection = async () => {
  isLaunchLoading.value = true

  try {
    let resp: string = await invoke('launch', { id: connectionsStore.editableComponent.id })
    let result: any = JSON.parse(resp)
    if (result.code == 1) {
      certificateStore.untrustedCert = result.cert
      certificateStore.showTrustCertDialog = true
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

const trustAndLaunchConnection = async () => {
  certificateStore.showTrustCertDialog = false
  await invoke("trust_cert", { cert: certificateStore.untrustedCert.der });
  await launchConnection()
}

const abortConnection = () => certificateStore.clearDialog()

const distinctGroups = computed(() => [
  ...new Set(connectionsStore.allConnections.map((connection: Connection) => connection.group))
])

const showPassword = ref(false)
const showPasswordIcon = computed(() => showPassword.value ? 'akar-icons:eye-open' : 'akar-icons:eye-slashed' )
const passwordFieldType = computed(() => showPassword.value ? 'text' : 'password' )
const showDeletionModal = ref(false)
const handleChannelDeletion = async (confirmed: boolean) => {
  showDeletionModal.value = false
  if (!confirmed) return
  await connectionsStore.deleteConnection(connectionsStore.selectedConnection)
}
</script>

<template>
  <form class="py-3 px-5 grid grid-cols-2 gap-2 dark:text-white" @submit.prevent>
    <fieldset class="col-span-2">
      <p>Connection name</p>
      <input
          class="w-full h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
          type="text"
          v-model="connectionsStore.editableComponent.name"
          placeholder="Connection's name e.g Acme Test Instance"
      />
    </fieldset>

    <fieldset class="col-span-2">
      <p>Connection address</p>
      <input
          class="w-full h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
          type="text"
          v-model="connectionsStore.editableComponent.address"
          placeholder="Mirth Connect URL e.g https://localhost:8443"
      />
    </fieldset>

    <fieldset class="col-span-1">
      <p>Username</p>
      <input
          class="w-full h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
          type="text"
          v-model="connectionsStore.editableComponent.username"
          placeholder="Username e.g admin"
      />
    </fieldset>

    <fieldset class="col-span-1">
      <p class="inline">Password</p>
      <icon class="ml-2 inline align-text-top hover:cursor-pointer" :icon="showPasswordIcon" @click="showPassword = !showPassword" />
      <input
        ref="passwordInputField"
        class="w-full h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
        :type="passwordFieldType"
        v-model="connectionsStore.editableComponent.password"
        placeholder="Password. Skip, if sensitive"
      />
    </fieldset>


    <fieldset class="col-span-2">
      <p>Java home</p>
      <input
          class="w-full h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
          type="text"
          v-model="connectionsStore.editableComponent.javaHome"
          placeholder="Path to Java Home directory"
      />
    </fieldset>

    <fieldset class="col-span-2">
      <p>Java args</p>
      <input
          class="w-full h-9 shadow-lg rounded-md px-2 dark:placeholder:text-input-placeholder-dark dark:bg-input-dark"
          type="text"
          v-model="connectionsStore.editableComponent.heapSize"
          placeholder="e.g. 512m or 2g"
      />
    </fieldset>

    <fieldset>
      <p class="inline">Verify certificates?</p>
      <input
        class="col-span-1 shadow-lg rounded-md ml-2 dark:bg-input-dark"
        type="checkbox"
        v-model="connectionsStore.editableComponent.verify"
      />
    </fieldset>

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
      class="col-span-2 border border-gray-700 py-1 bg-blue-500 text-white font-bold"
      @click="saveConnection"
    >
      Save
    </button>
    <button
      class="col-span-2 border border-gray-700 py-1 bg-green-700 text-white font-bold"
      @click="launchConnection"
    >
      Open
    </button>
    <button
      class="col-span-2 border border-gray-700 py-1 bg-red-700 text-white font-bold"
      @click="showDeletionModal = true"
    >
      Delete
    </button>
  </form>

  <teleport to="body">
    <confirm-cancel-dialog
        v-if="showDeletionModal"
        description="Are you sure you want to delete this channel?"
        @on-confirm="handleChannelDeletion(true)"
        @on-cancel="handleChannelDeletion(false)"
    />

    <trust-client-certificate-dialog
        v-if="certificateStore.showTrustCertDialog"
        @on-confirm="trustAndLaunchConnection()"
        @on-cancel="abortConnection()"
    />
  </teleport>
</template>
