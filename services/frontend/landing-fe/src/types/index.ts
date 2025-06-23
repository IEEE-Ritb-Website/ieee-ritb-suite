export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  registerLink: string;
}

export interface Coordinator {
  id: string;
  name: string;
  department: string;
  image: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
}