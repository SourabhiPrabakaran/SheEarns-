export function formatINR(amount: number): string {
  if (isNaN(amount)) return "₹0";
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
}

export function formatPercent(value: number, decimals: number = 0): string {
  if (isNaN(value)) return "0%";
  return `${value.toFixed(decimals)}%`;
}

export function formatMonths(months: number): string {
  if (isNaN(months)) return "0 mos";
  return `${months.toFixed(1)} mo${months === 1 ? '' : 's'}`;
}
