import { reactive, ref } from 'vue'

import { requestBallistaInfo } from '@/types/BallistaInfo'
import type { BallistaInfo } from '@/types/BallistaInfo'

export const infoStore = reactive({
  ballistaInfo: (await requestBallistaInfo()) as BallistaInfo
})

export const themeStore = {
  isDark: ref(localStorage.theme == 'dark')
}
