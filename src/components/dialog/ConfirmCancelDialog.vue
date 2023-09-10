<script setup lang="ts">
defineEmits(['onConfirm', 'onCancel'])

defineProps({
  description: String
})
</script>

<template>
  <div class="absolute z-10 top-0 left-0 w-screen h-screen">
    <div class="absolute z-10 top-0 w-screen h-screen bg-black opacity-30"></div>
    <div class="absolute z-20 w-screen h-screen grid place-items-center">
      <div
        class="bg-connection-light h-32 w-96 rounded-sm p-2 flex flex-col justify-around border-gray-300 border-4"
      >
        <p class="mx-auto">{{ description }}</p>

        <div class="w-full grid grid-cols-2 gap-5">
          <button
            class="border-2 border-gray-400 rounded-sm hover:shadow-lg"
            @click="$emit('onConfirm')"
          >
            Confirm
          </button>
          <button
            class="border-2 border-gray-400 rounded-sm hover:shadow-lg"
            @click="$emit('onCancel')"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
