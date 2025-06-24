import React from 'react';
import { Linkedin, Twitter, Mail, BookOpen, Calendar, Lightbulb, Newspaper, FileText, Code, Database, Activity } from 'lucide-react';

// ------------------ Mock Data ------------------



export const coordinators = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    department: 'Electrical Engineering',
    image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'mailto:sarah@example.com',
    },
  },
  {
    id: '2',
    name: 'Prof. Michael Lee',
    department: 'Computer Science',
    image: 'https://images.pexels.com/photos/5212339/pexels-photo-5212339.jpeg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:michael@example.com',
    },
  },
  {
    id: '3',
    name: 'Dr. Emma Rodriguez',
    department: 'Biomedical Engineering',
    image: 'https://images.pexels.com/photos/5212326/pexels-photo-5212326.jpeg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
      email: 'mailto:emma@example.com',
    },
  },
  {
    id: '4',
    name: 'Prof. David Kim',
    department: 'Mechanical Engineering',
    image: 'https://images.pexels.com/photos/8617942/pexels-photo-8617942.jpeg',
    socialLinks: {
      linkedin: 'https://linkedin.com',
      email: 'mailto:david@example.com',
    },
  },
];



export const resourceIcons = {
  BookOpen,
  Calendar,
  Lightbulb,
  Newspaper,
  FileText,
  Code,
  Database,
  Activity,
};

// ------------------ Coordinators Component ------------------

const Coordinators: React.FC = () => {
  const duplicatedCoordinators = [...coordinators, ...coordinators];

  return (
    <section className="py-20 ">
      <div className="container mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Faculty Coordinators
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Meet our dedicated faculty members who guide and support the IEEE
            Student Branch.
          </p>
        </div>
      </div>

      <div className="overflow-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {duplicatedCoordinators.map((coordinator, index) => (
            <div
              key={`${coordinator.id}-${index}`}
              className="min-w-[280px] w-[280px] mx-4 flex-shrink-0"
            >
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="h-48 overflow-hidden">
                  <img
                    src={coordinator.image}
                    alt={coordinator.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-yellow font-bold text-lg">
                    {coordinator.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-3">
                    {coordinator.department}
                  </p>
                  <div className="flex space-x-2">
                    {coordinator.socialLinks.linkedin && (
                      <a
                        href={coordinator.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary rounded-full hover:bg-accent transition-colors"
                        aria-label={`LinkedIn profile of ${coordinator.name}`}
                      >
                        <Linkedin className="h-4 w-4 text-white" />
                      </a>
                    )}
                    {coordinator.socialLinks.twitter && (
                      <a
                        href={coordinator.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary rounded-full hover:bg-accent transition-colors"
                        aria-label={`Twitter profile of ${coordinator.name}`}
                      >
                        <Twitter className="h-4 w-4 text-white" />
                      </a>
                    )}
                    {coordinator.socialLinks.email && (
                      <a
                        href={coordinator.socialLinks.email}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-primary rounded-full hover:bg-accent transition-colors"
                        aria-label={`Email ${coordinator.name}`}
                      >
                        <Mail className="h-4 w-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Coordinators;
