/** @format */

import { DataProps, DataPropsArray } from '@/types/agent_data_props';

export interface ShowTableProps {
  data: DataPropsArray;
  heading: string;
  showFullDetails?: boolean;
  setShowFullDetails: (type: boolean) => void;
  setDetailsToCheck: ({}: DataProps) => void;
}
