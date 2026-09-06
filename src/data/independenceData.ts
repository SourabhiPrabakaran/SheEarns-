export interface IndependenceQuestion {
  id: number;
  question: string;
}

export const INDEPENDENCE_QUESTIONS: IndependenceQuestion[] = [
  { id: 1, question: "Do you have independent access to your income?" },
  { id: 2, question: "Can you independently access your bank account or financial information?" },
  { id: 3, question: "Can you make personal financial decisions without being prevented from doing so?" },
  { id: 4, question: "Do you have access to money in case of an emergency?" },
  { id: 5, question: "Are important financial documents accessible to you?" }
];

export const NCW_HELPLINE_URL = "https://ncwapps.nic.in/helplines.aspx";
