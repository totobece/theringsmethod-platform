import React from "react";

type LoaderProps = object;

const MyLoader: React.FC<LoaderProps> = () => {
  return (
    <div className="justify-center w-full md:w-1/3 lg:w-1/4 mb-6 px-4">
        <div
          className="card rounded-xl boxshadow p-[16px] max-w-full min-h-[300px] mb-5 bg-cream animate-pulse"
        ></div>
    </div>
  );
};

export default MyLoader;
