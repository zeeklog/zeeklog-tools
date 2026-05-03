'use client'

import { AddressGeneratorToolBase } from './AddressGeneratorToolBase'

export function UsAddressGeneratorTool() {
  return <AddressGeneratorToolBase kind="us" downloadName="us-addresses" />
}

export function UkAddressGeneratorTool() {
  return <AddressGeneratorToolBase kind="uk" downloadName="uk-addresses" />
}

export function HkAddressGeneratorTool() {
  return <AddressGeneratorToolBase kind="hk" downloadName="hk-addresses" />
}

export function SgAddressGeneratorTool() {
  return <AddressGeneratorToolBase kind="sg" downloadName="singapore-addresses" />
}

export function CaliforniaAddressGeneratorTool() {
  return <AddressGeneratorToolBase kind="california" downloadName="california-addresses" />
}

export function NewZealandAddressGeneratorTool() {
  return <AddressGeneratorToolBase kind="newzealand" downloadName="newzealand-addresses" />
}

export function SpainAddressGeneratorTool() {
  return <AddressGeneratorToolBase kind="spain" downloadName="spain-addresses" />
}
