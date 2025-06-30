import React from "react";

type LoaderProps = object;

const WeekVideoSliderSkeleton: React.FC<LoaderProps> = () =>  {
    return (
        <div className="flex flex-col justify-center min-w-[300px] max-w-[300px]">
            <div className="justify-center flex">
                <div className="card rounded-xl boxshadow p-[20px] w-full min-h-[320px] mb-5 bg-gray-300 animate-pulse relative overflow-hidden">
                    {/* Duración en la parte superior */}
                    <div className="bg-gray-400 w-16 h-6 rounded-full mb-4 animate-pulse"></div>
                    
                    {/* Espacio para la imagen de preview en el centro */}
                    <div className="flex-1 flex justify-center items-center mb-4">
                        <div className="bg-gray-400 w-full h-32 rounded-md animate-pulse"></div>
                    </div>
                    
                    {/* Título y día en la parte inferior */}
                    <div className="mt-auto text-right">
                        <div className="bg-gray-400 h-5 w-3/4 rounded mb-2 ml-auto animate-pulse"></div>
                        <div className="bg-gray-400 h-4 w-1/2 rounded ml-auto animate-pulse"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WeekVideoSliderSkeleton;