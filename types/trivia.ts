export type Difficulty = "easy" | "medium" | "hard";

export interface TriviaQuestion {
  type: "multiple" | "boolean";
  difficulty: Difficulty;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaResponse {
  response_code: number;
  results: TriviaQuestion[];
}
