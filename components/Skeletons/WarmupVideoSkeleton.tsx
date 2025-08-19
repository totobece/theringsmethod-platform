export default function WarmupVideoSkeleton() {
    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            {/* Video Player Skeleton */}
            <div className="mb-8">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative animate-pulse">
                    {/* Background skeleton */}
                    <div className="w-full h-full bg-gray-800"></div>
                    
                    {/* Loading text and play button overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        {/* Play button skeleton */}
                        <div className="w-16 h-16 bg-gray-600 rounded-full mb-4 flex items-center justify-center">
                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                            </svg>
                        </div>
                        
                        {/* Loading text */}
                        <div className="text-center">
                            <p className="text-white text-lg font-medium mb-2">Loading Video</p>
                            <p className="text-gray-400 text-sm">Cargando video...</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Title Skeleton */}
            <div className="mb-2 md:mb-4">
                <div className="h-8 md:h-12 lg:h-14 bg-gray-600 rounded-md w-2/3 mb-2 animate-pulse"></div>
                <div className="h-6 md:h-8 lg:h-10 bg-gray-700 rounded-md w-1/3 animate-pulse"></div>
            </div>
        </div>
    );
}
