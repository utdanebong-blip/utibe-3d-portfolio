import { Project, AboutData, ResumeData, ContactInfo, Plugin, BlogPost } from '@/types/portfolio';
import { demoProjects, demoAboutData, demoResumeData, demoContactInfo, demoPlugins, demoBlogPosts, demoShowreel } from '@/data/demoData';

export const projects: Project[] = demoProjects;
export const aboutData: AboutData = demoAboutData;
export const resumeData: ResumeData = demoResumeData;
export const contactInfo: ContactInfo = demoContactInfo;
export const plugins: Plugin[] = demoPlugins;
export const posts: BlogPost[] = demoBlogPosts;
export const showreel = demoShowreel;

export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}

export function getPost(id: string) {
  return posts.find((p) => p.id === id);
}

