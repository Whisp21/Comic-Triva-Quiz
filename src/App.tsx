import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
import { QuestionState, Difficulty } from './API';
import QuestionCard from './components/QuestionCard';
import './styles/styles.scss';

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(true);
  const [message, setMessage] = useState('');

  const startQuiz = async() => {
    setMessage('');
    setLoading(true);
    setQuizOver(false);

    const questions = await fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.MEDIUM);

    setQuestions(questions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);
    setLoading(false);
  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    const answer = e.currentTarget.value;
    const correct = questions[number].correct_answer === answer;
    if (!quizOver) {
      if(correct) {
        setScore(prev => prev + 1);
        e.currentTarget.style.backgroundColor = '#C6FFC1';
      } else {
        e.currentTarget.style.backgroundColor = '#FF5656';
        setMessage(`Answer: ${questions[number].correct_answer}`);
      }
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer,
      }
      setUserAnswers((prev) => [...prev, answerObject]);
    }
  }

  const nextQuestion = () => {
    setMessage('');
    const nextQuestion = number + 1;
    if(nextQuestion === TOTAL_QUESTIONS) {
      setQuizOver(true);
    } else {
      setNumber(nextQuestion);
    }
  }

  return (
    <div className="app">
    <h1>Comics Trivia Quiz</h1>
    {quizOver || userAnswers.length === TOTAL_QUESTIONS ?
      <button className="startBtn" onClick={startQuiz}>Start</button>
      : null}
    {!quizOver ? <p className="score">Score:{score}</p> : null}
    {loading && <p>Loading questions...</p>}
    {!loading && !quizOver &&
      <QuestionCard
        questionNr={number + 1}
        totalQuestions={TOTAL_QUESTIONS}
        question={questions[number].question}
        answers={questions[number].answers}
        userAnswer={userAnswers ? userAnswers[number] : undefined}
        callback={checkAnswer}
      />}
      {!quizOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
        <button className="next" onClick={nextQuestion}>Next</button>
      ) : null}
    <p>{message}</p>
    </div>
  );
}

export default App;
