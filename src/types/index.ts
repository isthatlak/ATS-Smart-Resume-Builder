
export interface FormData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
  };
  summary?: string;
  experience: WorkExperience[];
  education: EducationItem[];
  skills: string[];
  certifications?: Certification[];
  languages?: Language[];
  projects?: Project[];
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  location?: string;
  startDate: string;
  endDate: string | 'Present';
  description: string;
  achievements: string[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate: string | 'Present';
  gpa?: string;
  achievements?: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expires?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: 'Elementary' | 'Limited Working' | 'Professional Working' | 'Full Professional' | 'Native';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  startDate?: string;
  endDate?: string;
}

export interface AtsAnalysisResult {
  score: number;
  suggestions: {
    keywords: {
      missing: string[];
      found: string[];
    };
    structure: {
      issues: string[];
      recommendations: string[];
    };
    formatting: {
      issues: string[];
      recommendations: string[];
    };
    content: {
      issues: string[];
      recommendations: string[];
    };
  };
}

export type TemplateType = 'harvard' | 'modern' | 'minimalist';
export type FileFormat = 'pdf' | 'docx';
