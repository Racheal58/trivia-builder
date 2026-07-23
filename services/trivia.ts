import { TriviaResponse, Difficulty, TriviaQuestion } from "@/types/trivia";

interface GetQuestionsParams {
  amount: number;
  category?: number;
  difficulty?: Difficulty;
  type?: "multiple" | "boolean";
}

const BASE_URL = "https://opentdb.com/api.php";
const CATEGORY_URL = "https://opentdb.com/api_category.php";

export async function getCategories() {
  try {
    const response = await fetch(CATEGORY_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    return data.trivia_categories;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getQuestions({
  amount,
  category,
  difficulty,
  type = "multiple",
}: GetQuestionsParams) {
  const params = new URLSearchParams({
    amount: amount.toString(),
    type,
  });

  if (category) {
    params.append("category", category.toString());
  }

  if (difficulty) {
    params.append("difficulty", difficulty);
  }

  const response = await fetch(`${BASE_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch trivia questions.");
  }

  const data: TriviaResponse = await response.json();

  if (data.response_code === 1) {
    return [];
  }

  return data.results;
}

export const difficulties = [
  {
    value: "easy",
    label: "Easy",
  },
  {
    value: "medium",
    label: "Medium",
  },
  {
    value: "hard",
    label: "Hard",
  },
];


export const questionTypes = [
  {
    value: "multiple",
    label: "Multiple Choice",
  },
  {
    value: "boolean",
    label: "True / False",
  },
];

