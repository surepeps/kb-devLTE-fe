'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register chart.js plugins once on component mount
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * This component is lazy-loaded to avoid bundling chart.js
 * in the main application bundle. It's only loaded when needed.
 */
export default function ChartContent() {
  return null;
}
