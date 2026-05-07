
import React from 'react';

export interface NavItem {
  name: string;
  path: string;
}

export interface ServicePillar {
  id: string;
  title: string;
  icon: React.ReactNode;
  descriptionShort: string;
  descriptionLong?: string;
  link: string;
}

export interface TeamMember {
  name: string;
  title: string;
  description: string;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: string;
  priceDetails: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary' | 'outline';
  discountInfo?: {
    annualPrice: string;
    savings: string;
  };
}

export interface PackageDeal extends PriceItem {
  originalPrice?: string;
}

export interface PriceItem {
  id: string;
  name: string;
  price: string;
  description?: string;
  duration?: string;
  note?: string;
  features?: string[];
  priceSuffix?: string;
}

export interface LocationInfo {
  name: string;
  description: string;
  address?: string; // For map link or display
  details?: string[];
}

export interface USPItem {
  title: string;
  description: string;
  icon: React.ReactElement;
}

export interface ContactMethod {
  name: string;
  details: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
}

export type UserRole = 'patient' | 'student' | 'dozent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan?: MembershipTier;
}

export interface Lecturer {
  id: string;
  name: string;
  email: string;
  institution: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  author: string;
  date: string; // e.g., "July 31, 2025"
  excerpt: string;
  content: string; // Can be Markdown or HTML string
  tags: string[];
}

export interface AITool {
  id: string;
  title: string;
  description: string;
  systemInstruction: string;
  placeholder: string;
  category?: 'clinical' | 'education' | 'general';
  allowedRoles?: UserRole[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Publication {
  id: number;
  Titel: string;
  Autoren: string;
  Jahr: string;
  Fachbereich: string;
  Unterkategorie: string;
  Dokumenttyp: string;
  Herausgeber: string;
  DOI_URL: string;
  Abstract: string;
  Open_Access: string;
  Downloadlink: string;
  Schlagwoerter: string;
}

// --- QUIZ & SPACED REPETITION TYPES ---

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false';
  question: string;
  options?: string[]; // Only for MC
  correctAnswer: string | boolean; // String for MC, boolean for TF
  explanation: string;
  topic: string; // e.g., "Anatomie", "Pathologie"
  _meta?: any;
}

export interface SpacedRepetitionItem {
  id: string;
  question: QuizQuestion;
  interval: number; // Days until next review
  easeFactor: number; // Multiplier for interval
  nextReviewDate: string; // ISO Date string
  repetitionCount: number;
}

export interface QuizSessionResult {
  totalQuestions: number;
  correctAnswers: number;
  details: {
    questionId: string;
    isCorrect: boolean;
  }[];
}

// --- CASE TRAINING TYPES ---

export interface CaseStep {
  titel: string;
  inhalt: string; // Description of what happens (Patient says X, Test Y shows Z)
  reflexionsfrage: string; // Question to the student
  model_answer: string; // The ideal clinical reasoning
  vital_signs_update?: { [key: string]: string }; // New: Update vital signs during case
}

export interface CaseStudy {
  id: string;
  title: string;
  patient_intro: string; // Initial scenario description
  initial_vitals?: { [key: string]: string }; // New: Initial vital signs
  steps: CaseStep[];
  difficulty: string;
  learning_goals: string[];
}

// --- EXAM SIMULATION TYPES ---

export interface ExamQuestion {
  id: string;
  type: 'multiple_choice' | 'open_text';
  question: string;
  options?: string[]; // for MC
  correctAnswer?: string; // for MC
  modelAnswer?: string; // for open text
  points: number;
  // New for AI Grading
  userAnswer?: string;
  aiGrading?: {
    score: number;
    feedback: string;
  };
  alignment?: string; // Kompetenz-Framework Alignment (z.B. RANZCP 3.2)
}

export interface Exam {
  id: string;
  title: string;
  durationMinutes: number;
  questions: ExamQuestion[];
  totalPoints: number;
  difficulty: string;
}

// --- ANALYTICS TYPES ---

export interface StudentDifficulty {
  id: string;
  caseTitle: string;
  stepTitle: string; // e.g., "Anamnese", "Hypothesenbildung"
  difficultyRate: number; // Percentage 0-100
  commonIssue: string; // The specific misconception
  affectedStudents: number;
  priority: 'high' | 'medium' | 'low';
}
