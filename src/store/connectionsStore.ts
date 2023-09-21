import { reactive } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'

import type { Connection } from '@/types/Connection'
import { loadConnections, getEmptyConnection, DEFAULT_GROUP_NAME } from '@/types/Connection'
import type { UntrustedCert } from "@/types/UntrustedCert";

export const connectionsStore = reactive({
  allConnections: (await loadConnections()) as Connection[],
  selectedConnection:
    this !== undefined && this.allConnections.length > 0
      ? this.allConnections[0]
      : getEmptyConnection(),
  editableComponent: getEmptyConnection(),
  async saveConnection(connection: Connection, followSelection: boolean) {
    if (this.editableComponent.group.trim().length == 0) {
      this.editableComponent.group = DEFAULT_GROUP_NAME
    }

    const saveResult = await invoke('save', { ce: JSON.stringify(connection) })
    console.log(saveResult)
    if (followSelection) {
      this.selectedConnection = { ...this.editableComponent } as Connection
    }

    this.allConnections = (await loadConnections()) as Connection[]
  },
  setSelectedConnection(connection: Connection) {
    this.selectedConnection = { ...connection } as Connection
    this.editableComponent = { ...connection } as Connection
  },
  async deleteConnection(connection: Connection) {
    const deletionResponse = await invoke('delete', { id: connection.id })
    console.log("delresp " + deletionResponse)

    this.allConnections = (await loadConnections()) as Connection[]
  }
})

export const certificateStore = reactive({
  untrustedCert: {} as UntrustedCert,
  showTrustCertDialog: false,
  clearDialog: () => {
    this.showTrustCertDialog = false
    this.untrustedCert = {} as UntrustedCert
  }
})