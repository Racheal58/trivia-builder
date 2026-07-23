"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  difficulties,
  getCategories,
  getQuestions,
  questionTypes,
} from "@/services/trivia";
import { Input } from "@/components/ui/input";
import { Difficulty, TriviaQuestion } from "@/types/trivia";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { decode } from "he";
import Loader from "./Loader";
import { ArrowRight, Eye, Trophy } from "lucide-react";
import { getCategoryIcon } from "@/utils/categoryIcons";

interface Category {
  id: number;
  name: string;
}

export default function QuestionForm() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<string | null>("");
  const [difficulty, setDifficulty] = useState<string | null>("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<string | null>("");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load categories when page opens
  useEffect(() => {
    async function loadCategories() {
      setLoading(true);

      try {
        const data = await getCategories();

        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCategories();
  }, []);

  async function handleGenerate() {
    if (!category) {
      return;
    }
    if (!amount) return;

    setLoading(true);

    try {
      setError("");

      const data = await getQuestions({
        amount: Number(amount),
        category: Number(category),
        difficulty: difficulty as Difficulty,
        type: type as "boolean" | "multiple" | undefined,
      });

      if (data.length === 0) {
        setError(
          "No questions found. Try changing your category, difficulty, or number of questions.",
        );
        return;
      }

      setQuestions(data);
    } catch (error) {
      console.error("Failed to load questions:", error);
    } finally {
      setLoading(false);
    }
  }

  const selectedCategory = categories.find(
    (item) => item.id.toString() === category,
  );

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  function handleReveal() {
    setRevealed(true);
  }

  function handleNext() {
    setCurrentQuestion((prev) => prev + 1);
    setRevealed(false);
  }

  function handleFinish() {
    setQuestions([]);
    setCurrentQuestion(0);
    setRevealed(false);

    // optional: reset selections
    setCategory("");
    setDifficulty("");
    setAmount("");
    setType("multiple");
  }

  return (
    <>
      {loading && categories.length === 0 ? (
        <Loader />
      ) : (
        <Card className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl border">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-4xl font-bold tracking-tight bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              <Trophy className="text-yellow-500" />
              Trivia
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Build a trivia round in seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {questions.length === 0 && (
              <div className="flex flex-col gap-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Category</Label>

                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue>
                        {selectedCategory?.name ?? "Select category"}
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const Icon = getCategoryIcon(item.name);
                              return <Icon className="h-4 w-4" />;
                            })()}

                            {item.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Difficulty */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Difficulty</Label>

                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>

                    <SelectContent>
                      {difficulties.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* Amount */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Number of Questions
                  </Label>

                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter number of questions"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Type</Label>

                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>

                    <SelectContent>
                      {questionTypes.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleGenerate}
                    disabled={loading || !category}
                    className="w-full h-12 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90"
                  >
                    {loading ? "Generating..." : "Generate Trivia"}
                  </Button>
                </div>
              </div>
            )}
            {/* Temporary Question Preview */}
            {questions.length > 0 && (
              <div className="rounded-2xl border bg-white p-8 shadow-sm space-y-6">
                <h2 className="text-xl font-semibold">Questions</h2>

                {questions.length > 0 && (
                  <>
                    {(() => {
                      const question = questions[currentQuestion];

                      const options =
                        question.type === "multiple"
                          ? [
                              ...question.incorrect_answers,
                              question.correct_answer,
                            ].sort(() => Math.random() - 0.5)
                          : ["True", "False"];

                      const CategoryIcon = getCategoryIcon(question.category);

                      return (
                        <div className="space-y-6">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CategoryIcon className="h-4 w-4" />

                            <span>{decode(question.category)}</span>

                            <span>•</span>

                            <span>{question.difficulty}</span>
                          </div>

                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>
                              Question {currentQuestion + 1} of{" "}
                              {questions.length}
                            </span>

                            <span>{Math.round(progress)}%</span>
                          </div>

                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full bg-linear-to-r from-indigo-500 to-purple-500 transition-all"
                              style={{
                                width: `${progress}%`,
                              }}
                            />
                          </div>
                          <div className="rounded-xl border bg-white p-6 shadow-sm space-y-6">
                            <h2 className="text-xl font-semibold leading-relaxed">
                              {decode(question.question)}
                            </h2>

                            <div className="grid gap-3">
                              {options.map((option, index) => {
                                const isCorrect =
                                  revealed &&
                                  option === question.correct_answer;

                                return (
                                  <div
                                    key={option}
                                    className={
                                      isCorrect
                                        ? `rounded-xl bg-green-500 text-white p-4 shadow-md`
                                        : `rounded-xl border bg-gray-50 p-4
                                          `
                                    }
                                  >
                                    {question.type === "multiple"
                                      ? `${String.fromCharCode(65 + index)}. `
                                      : ""}
                                    {decode(option)}
                                  </div>
                                );
                              })}
                            </div>

                            {!revealed ? (
                              <Button
                                onClick={handleReveal}
                                className="w-full rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700
                                "
                              >
                                <Eye /> Reveal Answer
                              </Button>
                            ) : currentQuestion === questions.length - 1 ? (
                              <Button
                                onClick={handleFinish}
                                className="w-full rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700"
                              >
                                <Trophy /> Finish Trivia
                              </Button>
                            ) : (
                              <Button
                                onClick={handleNext}
                                className="w-full rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                              >
                                <ArrowRight /> Next Question
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </>
                )}
              </div>
            )}

            {error && <p className="text-sm text-red-500 py-2">{error}</p>}
          </CardContent>
        </Card>
      )}
    </>
  );
}
