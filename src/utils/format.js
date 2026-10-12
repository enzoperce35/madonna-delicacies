export const peso = (amount) =>
  `₱${amount.toLocaleString('en-PH', { maximumFractionDigits: 0 })}`

// Always two decimals, for discount amounts and discounted totals
export const peso2 = (amount) =>
  `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`