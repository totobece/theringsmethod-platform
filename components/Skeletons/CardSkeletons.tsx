import React from "react";

type LoaderProps = object;

const MyLoader: React.FC<LoaderProps> = () => {
  return (
    <div className="relative my-4 px-4 justify-center w-full md:w-1/3 lg:w-1/4">
        <div
          className="relative aspect-video mx-auto rounded-xl md:w-full w-[90%] bg-cream animate-pulse"
        ></div>
    </div>
  );
};

export default MyLoader;
