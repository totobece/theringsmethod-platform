export default function DetailsPreviewSkeleton() {
    return(
        <div className="h-[600px] relative w-full bg-gray-300 mx-auto place-content-stretch text-center animate-pulse">
        <div className='absolute z-10 bottom-0 left-0 mx-16 sm:px-6 w-5/6 mb-10'>
          <div className="h-6 bg-gray-900 mb-2 max-w-[150px] rounded-xl"></div>
          <div className="h-8 bg-gray-900 max-w-[250px] rounded-xl"></div>
        </div>
      </div>

    );

}