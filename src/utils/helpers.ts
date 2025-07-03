export function formatDate(date: string | Date): string {
  if (!date) return '-'; // Return fallback for missing dates
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '-'; // Return fallback for invalid dates
  return parsedDate.toLocaleDateString(); // Format valid dates
}