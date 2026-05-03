import { jwtDecode, type JwtHeader, type JwtPayload } from 'jwt-decode'
import { ALGORITHM_DESCRIPTIONS, CLAIM_DESCRIPTIONS } from '@/lib/tools/data/jwt-claims'

export type JwtClaimRow = {
  value: string
  friendlyValue: string | undefined
  claim: string
  claimDescription: string | undefined
}

function dateFormatter(value: unknown): string | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  const date = new Date(Number(value) * 1000)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

function getFriendlyValue({ claim, value }: { claim: string; value: unknown }): string | undefined {
  if (['exp', 'nbf', 'iat'].includes(claim)) {
    return dateFormatter(value)
  }

  if (claim === 'alg' && typeof value === 'string') {
    return ALGORITHM_DESCRIPTIONS[value]
  }

  return undefined
}

function parseClaims({ claim, value }: { claim: string; value: unknown }): JwtClaimRow {
  const claimDescription = CLAIM_DESCRIPTIONS[claim]
  const formattedValue =
    typeof value === 'object' && value !== null ? JSON.stringify(value, null, 3) : String(value)
  const friendlyValue = getFriendlyValue({ claim, value })

  return {
    value: formattedValue,
    friendlyValue,
    claim,
    claimDescription,
  }
}

export function decodeJwt({ jwt }: { jwt: string }): { header: JwtClaimRow[]; payload: JwtClaimRow[] } {
  const rawHeader = jwtDecode<JwtHeader>(jwt, { header: true })
  const rawPayload = jwtDecode<JwtPayload>(jwt)

  const header = Object.entries(rawHeader).map(([claim, value]) => parseClaims({ claim, value }))
  const payload = Object.entries(rawPayload as Record<string, unknown>).map(([claim, value]) =>
    parseClaims({ claim, value }),
  )

  return { header, payload }
}
