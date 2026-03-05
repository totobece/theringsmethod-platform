import React from "react";

type LoaderProps = object;

const WeekVideoSliderSkeleton: React.FC<LoaderProps> = () => {
  return (
    <div className="flex-shrink-0 min-w-[300px] md:min-w-[400px]">
      <div className="bg-trm-black border border-pink/30 rounded-[20px] overflow-hidden h-[240px] animate-pulse">
        <div className="w-full h-full bg-trm-muted/10 relative">
          {/* Title skeleton centered */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%]">
            <div className="h-6 bg-trm-muted/20 rounded-md mx-auto mb-2" />
            <div className="h-4 bg-trm-muted/15 rounded-md mx-auto w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekVideoSliderSkeleton;
