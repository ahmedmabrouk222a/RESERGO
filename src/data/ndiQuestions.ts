export interface NDIQuestionSection {
  id: number;
  title: string;
  description: string;
  options: {
    score: number;
    label: string;
  }[];
}

export const NDI_SECTIONS: NDIQuestionSection[] = [
  {
    id: 1,
    title: "Section 1: Pain Intensity",
    description: "Please select the statement that best describes your neck pain right now.",
    options: [
      { score: 0, label: "I have no pain at the moment." },
      { score: 1, label: "The pain is very mild at the moment." },
      { score: 2, label: "The pain is moderate at the moment." },
      { score: 3, label: "The pain is fairly severe at the moment." },
      { score: 4, label: "The pain is very severe at the moment." },
      { score: 5, label: "The pain is the worst imaginable at the moment." }
    ]
  },
  {
    id: 2,
    title: "Section 2: Personal Care (Washing, Dressing, etc.)",
    description: "Please select the statement that best describes how neck pain affects your personal care.",
    options: [
      { score: 0, label: "I can look after myself normally without causing extra pain." },
      { score: 1, label: "I can look after myself normally but it causes extra pain." },
      { score: 2, label: "It is painful to look after myself and I am slow and careful." },
      { score: 3, label: "I need some help but manage most of my personal care." },
      { score: 4, label: "I need help every day in most aspects of self care." },
      { score: 5, label: "I do not get dressed, I wash with difficulty and stay in bed." }
    ]
  },
  {
    id: 3,
    title: "Section 3: Lifting",
    description: "Please select the statement that best describes your ability to lift objects.",
    options: [
      { score: 0, label: "I can lift heavy weights without extra pain." },
      { score: 1, label: "I can lift heavy weights but it gives extra pain." },
      { score: 2, label: "Pain prevents me from lifting heavy weights off the floor, but I can manage if they are conveniently positioned, e.g. on a table." },
      { score: 3, label: "Pain prevents me from lifting heavy weights, but I can manage light to medium weights if they are conveniently positioned." },
      { score: 4, label: "I can lift very light weights." },
      { score: 5, label: "I cannot lift or carry anything at all." }
    ]
  },
  {
    id: 4,
    title: "Section 4: Reading",
    description: "Please select the statement that best describes your ability to read books or digital screens.",
    options: [
      { score: 0, label: "I can read as much as I want to with no pain in my neck." },
      { score: 1, label: "I can read as much as I want to with slight pain in my neck." },
      { score: 2, label: "I can read as much as I want to with moderate pain in my neck." },
      { score: 3, label: "I cannot read as much as I want because of moderate pain in my neck." },
      { score: 4, label: "I can hardly read at all because of severe pain in my neck." },
      { score: 5, label: "I cannot read at all." }
    ]
  },
  {
    id: 5,
    title: "Section 5: Headaches",
    description: "Please select the statement that best describes headache frequency or intensity related to neck pain.",
    options: [
      { score: 0, label: "I have no headaches at all." },
      { score: 1, label: "I have slight headaches which come infrequently." },
      { score: 2, label: "I have moderate headaches which come infrequently." },
      { score: 3, label: "I have moderate headaches which come frequently." },
      { score: 4, label: "I have severe headaches which come frequently." },
      { score: 5, label: "I have headaches almost all the time." }
    ]
  },
  {
    id: 6,
    title: "Section 6: Concentration",
    description: "Please select the statement that best describes your ability to concentrate.",
    options: [
      { score: 0, label: "I can concentrate fully when I want to with no difficulty." },
      { score: 1, label: "I can concentrate fully when I want to with slight difficulty." },
      { score: 2, label: "I have a fair degree of difficulty in concentrating when I want to." },
      { score: 3, label: "I have a lot of difficulty in concentrating when I want to." },
      { score: 4, label: "I have a great deal of difficulty in concentrating when I want to." },
      { score: 5, label: "I cannot concentrate at all." }
    ]
  },
  {
    id: 7,
    title: "Section 7: Work",
    description: "Please select the statement that best describes your ability to do work/study activities.",
    options: [
      { score: 0, label: "I can do as much work as I want to." },
      { score: 1, label: "I can only do my usual work, but no more." },
      { score: 2, label: "I can do most of my usual work, but no more." },
      { score: 3, label: "I cannot do my usual work." },
      { score: 4, label: "I can hardly do any work at all." },
      { score: 5, label: "I cannot do any work at all." }
    ]
  },
  {
    id: 8,
    title: "Section 8: Driving",
    description: "Please select the statement that best describes your ability to drive a car or ride transport.",
    options: [
      { score: 0, label: "I can drive my car without any neck pain." },
      { score: 1, label: "I can drive my car as long as I want with slight pain in my neck." },
      { score: 2, label: "I can drive my car as long as I want with moderate pain in my neck." },
      { score: 3, label: "I cannot drive my car as long as I want because of moderate pain in my neck." },
      { score: 4, label: "I can hardly drive at all because of severe pain in my neck." },
      { score: 5, label: "I cannot drive my car at all." }
    ]
  },
  {
    id: 9,
    title: "Section 9: Sleeping",
    description: "Please select the statement that best describes how neck pain affects your sleep.",
    options: [
      { score: 0, label: "I have no trouble sleeping." },
      { score: 1, label: "My sleep is slightly disturbed (less than 1 hr sleepless)." },
      { score: 2, label: "My sleep is mildly disturbed (1-2 hrs sleepless)." },
      { score: 3, label: "My sleep is moderately disturbed (2-3 hrs sleepless)." },
      { score: 4, label: "My sleep is greatly disturbed (3-5 hrs sleepless)." },
      { score: 5, label: "My sleep is completely disturbed (5-7 hrs sleepless)." }
    ]
  },
  {
    id: 10,
    title: "Section 10: Recreation",
    description: "Please select the statement that best describes your participation in recreational activities.",
    options: [
      { score: 0, label: "I am able to engage in all my recreation activities with no neck pain at all." },
      { score: 1, label: "I am able to engage in all my recreation activities with some pain in my neck." },
      { score: 2, label: "I am able to engage in most, but not all, of my usual recreation activities because of pain in my neck." },
      { score: 3, label: "I am able to engage in a few of my usual recreation activities because of pain in my neck." },
      { score: 4, label: "I can hardly do any recreation activities because of pain in my neck." },
      { score: 5, label: "I cannot do any recreation activities at all." }
    ]
  }
];
