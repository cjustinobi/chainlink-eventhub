import { ethers } from 'ethers'

export const truncate = (input: string) => input ? `${input.substring(0, 5)}...${input.slice(-4)}` : ''

export const toTimestamp = (time: string | number | Date) => time ? (new Date(time)).getTime() / 1000 : undefined

export const timestampToDate = (ts: number) => {
  if (!ts) return
  const d = new Date(ts * 1000)
  return `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}

export const priceToWei = (price: number) => price ? ethers.utils.parseEther((price).toString()).toString() : 0

export const priceToEther = (price: number) => price ? ethers.utils.formatUnits((price).toString()).toString() : 0

export const platformFee = (deposit: number) => (deposit * 10) / 100
