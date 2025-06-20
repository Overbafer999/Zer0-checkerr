export function isValidAddress(address: string): boolean {
  // Check if address is exactly 42 characters and starts with 0x
  if (!address || address.length !== 42 || !address.startsWith("0x")) {
    return false
  }

  // Check if the rest are valid hex characters
  const hexPart = address.slice(2)
  return /^[0-9a-fA-F]+$/.test(hexPart)
}

export function formatAddress(address: string, startChars = 6, endChars = 4): string {
  if (!address || address.length < startChars + endChars) {
    return address
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}
