import React from 'react';

interface SelectedBriefsBarProps {
  selectedBriefs: number;
  selectedBriefsList?: any[];
  onViewBrief: () => void;
  onSubmitForInspection: () => void;
}

const MobileSelectedBottomBar: React.FC<SelectedBriefsBarProps> = ({
  selectedBriefs,
  selectedBriefsList = [],
  onViewBrief,
  onSubmitForInspection,
}) => (
  <div className="w-full flex flex-col gap-3 bg-white py-5 px-5 bottom-0 left-0 right-0 md:hidden">
    <div className="text-[#000] text-base font-medium">
      <span className="text-red-500 font-bold">({selectedBriefs})</span> Brief{Number(selectedBriefs) === 1 ? '' : 's'} selected for inspection
    </div>
    <div className="flex gap-3 w-full">
      <button
        className="h-[50px] border-[1px] border-[#5A5D6380] text-[#09391C] font-medium w-[40%]"
        type="button"
        onClick={onViewBrief}
      >
        View Listing
      </button>
      <button
        className="h-[50px] bg-[#8DDB90] text-white font-medium w-[60%]"
        type="button"
        onClick={onSubmitForInspection}
      >
        Submit for inspection
      </button>
    </div>
  </div>
);

export default MobileSelectedBottomBar;