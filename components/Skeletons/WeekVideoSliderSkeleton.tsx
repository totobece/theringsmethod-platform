import React from "react";

interface LoaderProps {}

const WeekVideoSliderSkeleton: React.FC<LoaderProps> = () =>  {
    return (
        <div className="flex flex-col justify-center min-w-[300px] px-3">
            <div className="justify-center flex">
                <div className="card rounded-xl boxshadow p-[20px] max-w-full h-auto mb-5 bg-gray-300 animate-pulse min-h-[400px] w-full">
                    {/* Episode badge skeleton */}
                    <div className="bg-gray-400 w-20 h-8 rounded-full mb-4 animate-pulse"></div>
                    
                    {/* Title skeleton */}
                    <div className="bg-gray-400 h-6 w-3/4 rounded mb-4 animate-pulse"></div>
                    
                    {/* Duration and icon skeleton */}
                    <div className="flex flex-row items-center mb-4">
                        <div className="bg-gray-400 h-6 w-1/3 rounded animate-pulse"></div>
                        <div className="bg-gray-400 h-11 w-11 rounded-full ml-auto animate-pulse"></div>
                    </div>
                    
                    {/* Image skeleton */}
                    <div className="bg-gray-400 w-full h-40 rounded-md animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}

export default WeekVideoSliderSkeleton;