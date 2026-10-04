export interface DASSQuestionItem {
  id: number; // 1 to 21
  text: string;
  category: 'depression' | 'anxiety' | 'stress';
}

export const DASS_RATING_OPTIONS = [
  { value: 0, label: "0 = Did not apply to me at all" },
  { value: 1, label: "1 = Applied to me to some degree, or some of the time" },
  { value: 2, label: "2 = Applied to me to a considerable degree or a good part of time" },
  { value: 3, label: "3 = Applied to me very much or most of the time" }
];

export const DASS_QUESTIONS: DASSQuestionItem[] = [
  { id: 1, text: "I found it hard to wind down", category: "stress" },
  { id: 2, text: "I was aware of dryness of my mouth", category: "anxiety" },
  { id: 3, text: "I couldn't seem to experience any positive feeling at all", category: "depression" },
  { id: 4, text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion)", category: "anxiety" },
  { id: 5, text: "I found it difficult to work up the initiative to do things", category: "depression" },
  { id: 6, text: "I tended to over-react to situations", category: "stress" },
  { id: 7, text: "I experienced trembling (e.g. in the hands)", category: "anxiety" },
  { id: 8, text: "I felt that I was using a lot of nervous energy", category: "stress" },
  { id: 9, text: "I was worried about situations in which I might panic and make a fool of myself", category: "anxiety" },
  { id: 10, text: "I felt that I had nothing to look forward to", category: "depression" },
  { id: 11, text: "I found myself getting agitated", category: "stress" },
  { id: 12, text: "I found it difficult to relax", category: "stress" },
  { id: 13, text: "I felt down-hearted and blue", category: "depression" },
  { id: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing", category: "stress" },
  { id: 15, text: "I felt I was close to panic", category: "anxiety" },
  { id: 16, text: "I was unable to become enthusiastic about anything", category: "depression" },
  { id: 17, text: "I felt I wasn't worth much as a person", category: "depression" },
  { id: 18, text: "I felt that I was rather touchy", category: "stress" },
  { id: 19, text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase or heart missing a beat)", category: "anxiety" },
  { id: 20, text: "I felt scared without any good reason", category: "anxiety" },
  { id: 21, text: "I felt that life was meaningless", category: "depression" }
];
