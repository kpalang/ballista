import { invoke } from '@tauri-apps/api/tauri'

export const DEFAULT_GROUP_NAME: string = 'Default'
export interface Connection {
  address: string
  heapSize: string
  icon: string
  id: string
  javaHome: string
  name: string
  username: string
  password: string
  verify: boolean
  group: string
  notes: string

  // the below properties are transient and are used only in the UI
  nodeId: string
  parentId: string
}

export async function loadConnections() {
  console.log('loading connections')
  const jsonArr: string = await invoke('load_connections')
  const data = JSON.parse(jsonArr)
  //data.sort(connectionSorter);
  return data
}

export function orderConnections(data: Connection[]) {
  const groupConnMap: any = {}
  let prevGroup = null
  for (let i = 0; i < data.length; i++) {
    const connection = data[i]
    let connectionArray = groupConnMap[connection.group]
    if (connectionArray === undefined || connectionArray === null) {
      connectionArray = new Array()
      groupConnMap[connection.group] = connectionArray
    }
    connectionArray.push(connection)
    if (prevGroup != null && prevGroup !== connection.group) {
      groupConnMap[prevGroup].sort(connectionSorter)
    }
    prevGroup = connection.group
  }
  if (prevGroup != null) {
    groupConnMap[prevGroup].sort(connectionSorter)
  }

  const groupNames = Object.keys(groupConnMap)
    .filter((val) => val != DEFAULT_GROUP_NAME)
    .sort()
  if (groupConnMap[DEFAULT_GROUP_NAME]) {
    groupNames.unshift(DEFAULT_GROUP_NAME)
  }

  return { groupNames, groupConnMap }
}
export function connectionSorter(c1: Connection, c2: Connection) {
  const n1 = c1.name.toLowerCase()
  const n2 = c2.name.toLowerCase()

  if (n1 > n2) {
    return 1
  } else if (n1 < n2) {
    return -1
  }

  return 0
}

export function searchText(token: string, c: Connection) {
  token = token.toLowerCase()
  for (const [key, val] of Object.entries(c)) {
    if (key == 'id') {
      continue
    }
    if (typeof val == 'string' && val.toLowerCase().indexOf(token) > -1) {
      return true
    }
  }
  return false
}

export function getEmptyConnection(): Connection {
  return {
    address: '',
    heapSize: '',
    icon: '',
    id: '',
    javaHome: '',
    name: '',
    username: '',
    password: '',
    verify: true,
    group: DEFAULT_GROUP_NAME,
    notes: '',
    nodeId: '',
    parentId: ''
  } as Connection
}
