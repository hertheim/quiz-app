"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface Question {
  category: string;
  id: number;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: {
    text: string;
  };
  tags: string[];
  type: string;
  difficulty: string;
  regions: string[];
  isNiche: boolean;
}

function Quiz() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulties");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [chosenAnswers, setChosenAnswers] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(
        `https://the-trivia-api.com/v2/questions?limit=15&categories=${category}&difficulties=${difficulty}`
      );
      const data: Question[] = await res.json();
      setQuestions(data);
      setChosenAnswers(Array(data.length).fill(""));
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAnswerOptionClick = (
    isCorrect: boolean,
    chosenAnswer: string
  ) => {
    const nextQuestion = currentQuestion + 1;
    if (isCorrect) {
      setScore(score + 1);
    }
    setChosenAnswers((prevChosenAnswers) => [
      ...prevChosenAnswers.slice(0, currentQuestion),
      chosenAnswer,
      ...prevChosenAnswers.slice(currentQuestion + 1),
    ]);

    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const shuffleAnswers = (
    correctAnswer: string,
    incorrectAnswers: string[]
  ): string[] => {
    const allAnswers = [correctAnswer, ...incorrectAnswers];
    return allAnswers.sort(() => Math.random() - 0.5);
  };

  return (
    <div className="flex flex-col w-11/12 mx-auto">
      {showScore ? (
        <div className="text-center">
          <div className="flex flex-col items-center mx-auto mt-6">
            <div className="flex justify-center"></div>
            <div className="text-4xl mb-6">
              You scored {score} out of {questions.length}!
            </div>
            <h2 className="text-4xl underline">Solution:</h2>
          </div>
          <div className="mt-8 bg-base-200 p-6 rounded-lg">
            {questions.map((question, index) => (
              <div key={index} className="mb-4 flex flex-col items-center">
                <div className="text-3xl mb-6">
                  <span>Question {index + 1}</span>/{questions.length}
                </div>
                <div className="text-2xl mb-2 grid grid-cols-[minmax(100px,_75rem)]">{question.question.text}</div>
                <div className="grid grid-cols-[minmax(100px,_75rem)_auto] items-center">
                  {shuffleAnswers(
                    question.correctAnswer,
                    question.incorrectAnswers || []
                  ).map((answerOption, optionIndex) => (
                    <>
                      <button
                        className={
                          question.correctAnswer === answerOption
                            ? "btn my-3 text-2xl h-auto bg-success pointer-events-none ml-8"
                            : "btn my-3 text-2xl h-auto bg-error pointer-events-none ml-8"
                        }
                        key={optionIndex}
                      >
                        {answerOption}
                      </button>
                      <div>
                        {" "}
                        {chosenAnswers[index] === answerOption ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-8 h-8"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          ""
                        )}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link href="/">
            <button className="btn btn-outline my-6 text-2xl">Go Back</button>
          </Link>
        </div>
      ) : (
        <>
          <div>
            <div className="text-5xl mb-6">
              <span>Question {currentQuestion + 1}</span>/{questions.length}
            </div>
            <div className="text-center text-2xl mb-4">
              {questions[currentQuestion]?.question.text}
            </div>
          </div>
          <div className="flex-col flex">
            {shuffleAnswers(
              questions[currentQuestion]?.correctAnswer,
              questions[currentQuestion]?.incorrectAnswers || []
            ).map((answerOption, index) => (
              <button
                className="btn my-3 text-2xl h-auto"
                key={index}
                onClick={() =>
                  handleAnswerOptionClick(
                    answerOption === questions[currentQuestion]?.correctAnswer,
                    answerOption
                  )
                }
              >
                {answerOption}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Quiz;
