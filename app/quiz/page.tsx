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
    <div className="flex flex-col w-4/5 mx-auto">
      {showScore ? (
        <div className="text-center">
          <div className="flex flex-col items-center mx-auto">
            <div className="flex justify-center">
            </div>
            <div className="text-4xl mb-6">
              You scored {score} out of {questions.length}!
            </div>
          </div>
          <div className="mt-8 bg-base-200 p-6 rounded-lg">
            <h2 className="text-4xl mb-6">Questions and Answers:</h2>
            {questions.map((question, index) => (
              <div key={index} className="mb-4">
                <div className="text-3xl mb-6">
                  <span>Question {index + 1}</span>/{questions.length}
                </div>
                <div className="text-2xl mb-2">{question.question.text}</div>
                <div className="flex-col flex">
                  {shuffleAnswers(
                    question.correctAnswer,
                    question.incorrectAnswers || []
                  ).map((answerOption, optionIndex) => (
                    <button
                      className={
                        question.correctAnswer === answerOption
                          ? "btn my-3 text-2xl h-auto bg-success pointer-events-none"
                          : "btn my-3 text-2xl h-auto bg-base-100 pointer-events-none"
                      }
                      key={optionIndex}
                    >
                      {answerOption}{" "}
                      {chosenAnswers[index] === answerOption
                        ? "(Your Choice)"
                        : ""}
                    </button>
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
