export default function MainPlayRoutineSkeleton () {
    return (
        <div className="w-full items-start">
            <div className="relative w-full min-h-[400px] md:min-h-[500px] flex flex-col md:flex-row p-6 border-[3px] border-gray-600 bg-gray-700 rounded-2xl md:rounded-3xl pt-4 mb-8 animate-pulse overflow-hidden">
                <div className='relative w-[70%] md:pt-0 pt-3 pl-3 md:pl-6'>
                    {/* Episode skeleton - más parecido al badge real */}
                    <div className='bg-gray-600 w-fit px-4 h-8 rounded-full md:mt-10'></div>
                    
                    {/* Title skeleton - responsive como el real */}
                    <div className="h-8 md:h-12 lg:h-14 bg-gray-600 rounded-md w-3/4 mt-4"></div>
                    
                    {/* Duration skeleton - responsive como el real */}
                    <div className="h-8 md:h-10 lg:h-12 bg-gray-600 rounded-md w-2/4 my-4"></div>
                    
                    {/* Button skeleton */}
                    <div className='relative h-[95%] mt-12'>
                        <div className="relative">
                            <div className="bg-wine h-10 w-[150px] md:w-[200px] rounded-[20px]"></div>
                        </div>
                    </div>
                </div>
                
                {/* Image skeleton */}
                <div className="w-full flex justify-end mr-4 items-center mt-4">
                    <div className="bg-gray-600 rounded-lg" style={{ width: '100%', height: '300px', maxWidth: '600px' }}></div>
                </div>
            </div>
        </div>
    );
}