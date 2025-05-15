import React from "react";

interface LoaderProps {}

const WeekVideoSliderSkeleton: React.FC<LoaderProps> = () =>  {
    return (
        <div className="flex sm:w-1/2 md:w-1/3 lg:w-1/4 my-6 w-[95%] justify-center ">

        
        <div className="card boxshadow aspect-square rounded-xl bg-gray-300 animate-pulse items-center"></div>
        </div>
    );
}

export default WeekVideoSliderSkeleton;