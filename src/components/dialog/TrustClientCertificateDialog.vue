<script setup lang="ts">
import { certificateStore } from '@/store/connectionsStore'

defineEmits(['onConfirm', 'onCancel'])
</script>

<template>
  <div class="absolute z-10 top-0 left-0 w-screen h-screen">
    <div class="absolute z-10 top-0 w-screen h-screen bg-black opacity-30"></div>
    <div class="absolute z-20 w-screen h-screen grid place-items-center">
      <div class="bg-connection-light h-2/3 w-2/3 rounded-sm p-2 flex flex-col justify-around border-gray-300 border-4">
        <p class="my-5 font-bold text-lg"> Unknown certificate</p>

        <p><span class="font-bold">Subject:</span> {{ certificateStore.untrustedCert.subject }}</p>
        <p><span class="font-bold">Issued By:</span> {{ certificateStore.untrustedCert.issuer }}</p>
        <p><span class="font-bold">Expires On:</span> {{ certificateStore.untrustedCert.expires_on }}</p>

        <p class="mt-5 mx-auto">Do you trust this certificate?</p>
        <div class="w-full grid grid-cols-2 gap-5">
          <button
            class="border-2 border-gray-400 rounded-sm hover:shadow-lg"
            @click="$emit('onConfirm')"
          >
            Yes
          </button>
          <button
            class="border-2 border-gray-400 rounded-sm hover:shadow-lg"
            @click="$emit('onCancel')"
          >
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
