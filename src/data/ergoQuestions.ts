export interface ErgoQuestionItem {
  key: 'laptop' | 'posture' | 'breaks' | 'chair';
  title: string;
  question: string;
  options: {
    score: number;
    label: string;
    description?: string;
  }[];
}

export const ERGO_QUESTIONS: ErgoQuestionItem[] = [
  {
    key: "laptop",
    title: "1. Laptop & Screen Ergonomics",
    question: "How do you position your primary display or laptop during extended work sessions?",
    options: [
      { score: 0, label: "Optimal Screen Height", description: "Top of screen at or slightly below eye level with external keyboard/mouse if using laptop." },
      { score: 1, label: "Suboptimal Height", description: "Screen slightly below eye level or laptop screen without elevation." },
      { score: 2, label: "Poor Screen Setup", description: "Laptop flat on desk looking down continuously, or extreme neck flexion required." }
    ]
  },
  {
    key: "posture",
    title: "2. Working Posture",
    question: "What is your predominant neck/back posture when studying or working at your workstation?",
    options: [
      { score: 0, label: "Neutral Posture", description: "Neutral spine, ears aligned over shoulders, back supported against chair." },
      { score: 1, label: "Intermittent Slouching", description: "Occasional forward head position or slouching during intense tasks." },
      { score: 2, label: "Pronounced Forward Head / Slouching", description: "Constant forward head posture ('text neck'), hunched shoulders, or unsupported posture." }
    ]
  },
  {
    key: "breaks",
    title: "3. Micro-Breaks & Movement",
    question: "How frequently do you take physical movement or stretching breaks from screen work?",
    options: [
      { score: 0, label: "Frequent Micro-Breaks", description: "Short 1-2 min break every 30 mins or stretch break every hour." },
      { score: 1, label: "Infrequent Breaks", description: "Break every 2 hours or only when feeling stiffness." },
      { score: 2, label: "Continuous Work (> 2-3 hrs)", description: "Work continuously for over 2-3 hours without changing posture or standing up." }
    ]
  },
  {
    key: "chair",
    title: "4. Chair & Seating Support",
    question: "What type of seating and support do you use during study or lab work?",
    options: [
      { score: 0, label: "Ergonomic Adjustable Chair", description: "Adjustable height, active lumbar support, and adjustable armrests." },
      { score: 1, label: "Basic Chair", description: "Standard chair with backrest but lacking lumbar adjustment or armrest support." },
      { score: 2, label: "Non-Ergonomic Seating / Stool / Bed", description: "Backless stool, hard wooden bench, sofa, or working on bed." }
    ]
  }
];
