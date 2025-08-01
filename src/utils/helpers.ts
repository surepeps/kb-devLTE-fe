export function formatDate(date: string | Date): string {
  if (!date) return '-'; // Return fallback for missing dates
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '-'; // Return fallback for invalid dates
  return parsedDate.toLocaleDateString(); // Format valid dates
}

export const kebabToTitleCase = (str: string): string => {
  if (!str) return "";

  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
