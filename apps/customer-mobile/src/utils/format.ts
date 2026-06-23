// Display a number as Philippine Peso, e.g. 50 -> "₱50.00".
export function formatPHP(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}
