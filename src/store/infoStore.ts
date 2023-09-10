import { reactive } from 'vue'

import { requestBallistaInfo } from '@/types/BallistaInfo'
import type { BallistaInfo } from '@/types/BallistaInfo'

export const infoStore = reactive({
  ballistaInfo: (await requestBallistaInfo()) as BallistaInfo
})
