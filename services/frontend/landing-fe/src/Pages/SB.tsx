import React from "react";
import Particles from "../Components/Particles";

const StudentBranch: React.FC = () => {
  return (
    <>
        <div className="min-h-screen text-white p-10 bg-[#05060f]">
      <h1 className="text-3xl font-bold">IEEE Student Branch</h1>
      <p className="mt-4">
        We are a community of innovators...
      </p>
    </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.5)_100%)] pointer-events-none" />
      <Particles
        className="absolute inset-0"
        quantity={200}
        ease={100}
        color="#ffffff"
        size={0.05}
        refresh
      />
    
    </>

  );
};

export default StudentBranch;
