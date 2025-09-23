// services/frontend/landing-fe/src/Pages/Faculty.tsx
import React from "react";
import { facultyList } from "../staticData/FacultyCoord";
import Particles from "@/Components/Particles";
import Navbar from "../Components/Navbar";

// Use type-only import for Coordinator
import FacultyCoordinators, { type Coordinator } from "../Components/FacultyCoordinators";

// helper to get initials
const getInitials = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const FacultyPage: React.FC = () => {
  // Map your existing facultyList into the Coordinator shape
  const data: Coordinator[] = facultyList.map((f, idx) => ({
    id: idx + 1,
    name: f.faculty,
    designation: f.role,
    initials: getInitials(f.faculty),
    image: f.imageUrl,
    // optional fields — remove the `as any` casts if you type facultyList properly
    department: (f as any).department || 'Faculty',
    expertise: (f as any).expertise || [],
    email: (f as any).email
  }));

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
        {/* Render the new component and pass mapped data */}
        <div className="mt-6 px-4">
          <FacultyCoordinators data={data} />
        </div>
      </div>
    </div>
  );
};

export default FacultyPage;
