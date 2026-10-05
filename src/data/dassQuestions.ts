export interface DASSQuestionItem {
  id: number; // 1 to 21
  text: string;
  category: 'depression' | 'anxiety' | 'stress';
  scaleTag: '(S)' | '(A)' | '(D)';
}

export const DASS_RATING_OPTIONS = [
  { value: 0, label: "0 = Did not apply to me at all" },
  { value: 1, label: "1 = Applied to me to some degree, or some of the time" },
  { value: 2, label: "2 = Applied to me to a considerable degree or a good part of time" },
  { value: 3, label: "3 = Applied to me very much or most of the time" }
];

export const DASS_QUESTIONS: DASSQuestionItem[] = [
  { id: 1, text: "I found it hard to wind down (S)", category: "stress", scaleTag: "(S)" },
  { id: 2, text: "I was aware of dryness of my mouth (A)", category: "anxiety", scaleTag: "(A)" },
  { id: 3, text: "I couldn't seem to experience any positive feeling at all (D)", category: "depression", scaleTag: "(D)" },
  { id: 4, text: "I experienced breathing difficulty (e.g. excessively rapid breathing, breathlessness in the absence of physical exertion) (A)", category: "anxiety", scaleTag: "(A)" },
  { id: 5, text: "I found it difficult to work up the initiative to do things (D)", category: "depression", scaleTag: "(D)" },
  { id: 6, text: "I tended to over-react to situations (S)", category: "stress", scaleTag: "(S)" },
  { id: 7, text: "I experienced trembling (e.g. in the hands) (A)", category: "anxiety", scaleTag: "(A)" },
  { id: 8, text: "I felt that I was using a lot of nervous energy (S)", category: "stress", scaleTag: "(S)" },
  { id: 9, text: "I was worried about situations in which I might panic and make a fool of myself (A)", category: "anxiety", scaleTag: "(A)" },
  { id: 10, text: "I felt that I had nothing to look forward to (D)", category: "depression", scaleTag: "(D)" },
  { id: 11, text: "I found myself getting agitated (S)", category: "stress", scaleTag: "(S)" },
  { id: 12, text: "I found it difficult to relax (S)", category: "stress", scaleTag: "(S)" },
  { id: 13, text: "I felt down-hearted and blue (D)", category: "depression", scaleTag: "(D)" },
  { id: 14, text: "I was intolerant of anything that kept me from getting on with what I was doing (S)", category: "stress", scaleTag: "(S)" },
  { id: 15, text: "I felt I was close to panic (A)", category: "anxiety", scaleTag: "(A)" },
  { id: 16, text: "I was unable to become enthusiastic about anything (D)", category: "depression", scaleTag: "(D)" },
  { id: 17, text: "I felt I wasn't worth much as a person (D)", category: "depression", scaleTag: "(D)" },
  { id: 18, text: "I felt that I was rather touchy (S)", category: "stress", scaleTag: "(S)" },
  { id: 19, text: "I was aware of the action of my heart in the absence of physical exertion (e.g. sense of heart rate increase or heart missing a beat) (A)", category: "anxiety", scaleTag: "(A)" },
  { id: 20, text: "I felt scared without any good reason (A)", category: "anxiety", scaleTag: "(A)" },
  { id: 21, text: "I felt that life was meaningless (D)", category: "depression", scaleTag: "(D)" }
];
