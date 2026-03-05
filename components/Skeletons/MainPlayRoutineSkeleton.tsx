export default function MainPlayRoutineSkeleton() {
  return (
    <div className="bg-trm-black border border-pink/30 rounded-[20px] overflow-hidden min-h-[auto] md:min-h-[600px] flex flex-col md:flex-row animate-pulse">
      {/* Left: Content area */}
      <div className="flex-shrink-0 md:w-[35%] p-8 md:p-[30px_40px] flex flex-col justify-start">
        {/* Badge skeleton */}
        <div className="w-20 h-7 bg-trm-muted/20 rounded-full mb-10 md:mb-[200px]" />

        {/* Title skeleton */}
        <div className="h-10 md:h-14 bg-trm-muted/20 rounded-md w-3/4 mb-4" />
        <div className="h-8 md:h-10 bg-trm-muted/20 rounded-md w-1/2 mb-8" />

        {/* Button skeleton */}
        <div className="h-12 w-[180px] bg-pink/20 rounded-full" />
      </div>

      {/* Right: Image area */}
      <div className="flex-shrink-0 md:w-[65%] min-h-[300px] bg-trm-muted/10" />
    </div>
  );
}
