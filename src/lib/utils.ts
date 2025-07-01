// Function to convert Ethereum address to UUID format
export function addressToUuid(address: string): string {
  // Remove '0x' prefix if present
  const cleanAddress = address.toLowerCase().replace("0x", "");

  // Pad with zeros to get 32 characters (128 bits)
  const paddedAddress = cleanAddress.padStart(32, "0");

  // Format as UUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const uuid = [
    paddedAddress.slice(0, 8),
    paddedAddress.slice(8, 12),
    paddedAddress.slice(12, 16),
    paddedAddress.slice(16, 20),
    paddedAddress.slice(20, 32),
  ].join("-");

  return uuid;
}
