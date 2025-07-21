import React from "react";
import { facultyList } from "../staticData/FacultyCoord";
import ProfileCard from "../Components/ProfileCard";
import Particles from "@/Components/Particles";
import Navbar from "../Components/Navbar";
import { Text } from "@/component/luxe/ui/text";

const FacultyPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-[#0d0a1a] overflow-hidden">
      <Particles
        className="fixed inset-0 z-0"
        quantity={400}
        ease={100}
        color="#ffffff"
        size={0.05}
        refresh
      />

      <Navbar />

      <div className="faculty-page relative z-10 pt-16">
        <div className="w-full text-center mt-5 px-4 sm:px-6 lg:px-8">
          <Text
            variant="shine"
            className="section-title font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl"
          >
            Faculty Coordinators
          </Text>
        </div>

        <div className="faculty-list flex flex-wrap justify-center gap-8 mt-8">
          {facultyList.map((faculty) => (
            <ProfileCard
              key={faculty.faculty}
              name={faculty.faculty}
              role={faculty.role}
              imageUrl={faculty.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
