import React from "react";

const MoreVideosSkeleton: React.FC = () => {
  return (
    <div className="relative my-4 px-4 justify-center w-full md:w-1/3 lg:w-1/4">
        <div
          className="relative aspect-video mx-auto rounded-[20px] md:w-full w-[90%] bg-trm-bg border border-pink/20 animate-pulse"
        ></div>
    </div>
  );
};

export default MoreVideosSkeleton;
