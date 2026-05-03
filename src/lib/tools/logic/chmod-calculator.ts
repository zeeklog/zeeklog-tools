export type ChmodScope = 'read' | 'write' | 'execute'
export type ChmodGroup = 'owner' | 'group' | 'public'

export type ChmodGroupPermissions = Record<ChmodScope, boolean>

export type ChmodPermissions = Record<ChmodGroup, ChmodGroupPermissions>

const PERM_NUM: ChmodGroupPermissions = { read: false, write: false, execute: false }

export function defaultChmodPermissions(): ChmodPermissions {
  return {
    owner: { ...PERM_NUM },
    group: { ...PERM_NUM },
    public: { ...PERM_NUM },
  }
}

const PERMISSION_VALUE: Record<ChmodScope, number> = { read: 4, write: 2, execute: 1 }

function groupOctal(permission: ChmodGroupPermissions): number {
  let acc = 0
  for (const key of ['read', 'write', 'execute'] as const) {
    if (permission[key]) {
      acc += PERMISSION_VALUE[key]
    }
  }
  return acc
}

export function computeChmodOctalRepresentation({ permissions }: { permissions: ChmodPermissions }): string {
  return [groupOctal(permissions.owner), groupOctal(permissions.group), groupOctal(permissions.public)].join('')
}

const PERMISSION_CHAR: Record<ChmodScope, string> = { read: 'r', write: 'w', execute: 'x' }

function groupSymbolic(permission: ChmodGroupPermissions): string {
  let acc = ''
  for (const key of ['read', 'write', 'execute'] as const) {
    acc += permission[key] ? PERMISSION_CHAR[key] : '-'
  }
  return acc
}

export function computeChmodSymbolicRepresentation({ permissions }: { permissions: ChmodPermissions }): string {
  return [groupSymbolic(permissions.owner), groupSymbolic(permissions.group), groupSymbolic(permissions.public)].join('')
}
