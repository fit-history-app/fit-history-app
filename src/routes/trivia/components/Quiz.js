import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import GameOver from './GameOver';

const QuizWindow = styled.div`
    text-align: center;
    font-size: clamp(20px, 2.5vw, 24px);
    margin-top: 10vh;
`;

const Options = styled.div`
    display: flex;
    flex-direction: column;
    width: 70%;
    margin: 2em auto;

    @media screen and (min-width: 1180px) {
        width: 50%;
    }
`;

const Option = styled.button`
    display: block;
    border: 1px solid #616A94;
    border-radius: 15px;
    padding: 15px 30px;
    text-decoration: none;
    color: #616A94;
    background-color: #161A31;
    transition: 0.3s;
    font-size: 1em;
    outline: none;
    user-select: none;
    margin-top: 1em;
    cursor: pointer;
    
    @media screen and (min-width: 1180px) {
        &:hover {
            color: white;
            background-color: #616A94;
        }
    }
`;

const Question = styled.div`
    width: 70%;
    margin: 0 auto;
`;

const Quiz = () => {

   const [quiz, setQuiz] = useState([]);
   const [number, setNumber] = useState(0);
   const [pts, setPts] = useState(0);

   const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

   const pickAnswer = (e) => {

      let userAnswer = e.target.outerText;

      if (quiz[number].answer === userAnswer) setPts(pts + 1);
      setNumber(number + 1);
   }

   useEffect(() => {

      const questions = JSON.parse(`
         {
            "questions": [
               {
                  "text": "What is Florida Tech's motto?",
                  "correct_answer": "Ad Astra Per Scientiam",
                  "incorrect_answers": [
                     "Sumus Scientiam Ad Gradum Proximum",
                     "Quinque Die Operantes Cum Planis",
                     "Ad Caelum Per Ipsum "
                  ]
               },
               {
                  "text": "How Many Presidents has Florida Tech had?",
                  "correct_answer": "5",
                  "incorrect_answers": [
                     "3",
                     "12",
                     "6"
                  ]
               },
               {
                  "text": "What frequency is WFIT on?",
                  "correct_answer": "89.5 FM",
                  "incorrect_answers": [
                     "76.3 FM",
                     "1642 AM",
                     "103.5 FM"
                  ]
               },
               {
                  "text": "What college sports division is Florida Tech?",
                  "correct_answer": "NCAA Division II",
                  "incorrect_answers": [
                     "NCAA Division III",
                     "NCAA Division I",
                     "American League"
                  ]
               },
               {
                  "text": "What does CAMID Stand for?",
                  "correct_answer":
                  "Center for Advanced Manufacturing and Innovative Design",
                  "incorrect_answers": [
                     "Center for Advancing and Mentoring Inspired Developers",
                     "Complex to Align Microscopic Induction Diodes",
                     "Counter for Aggravation of Mammalian Immune Disorders"
                  ]
               }
            ]
         }`
      ).questions;


      setQuiz(questions.map(item => (

         {
            question: item.text,
            options: shuffle([...item.incorrect_answers, item.correct_answer]),
            answer: item.correct_answer
         }

      )));


   }, []);


   return (
      <QuizWindow>
         {quiz[number] &&

            <>
               <Question dangerouslySetInnerHTML={{ __html: quiz[number].question }}></Question>

               <Options>
                  {quiz[number].options.map((item, index) => (
                     <Option key={index} dangerouslySetInnerHTML={{ __html: item }} onClick={pickAnswer}></Option>
                  ))}
               </Options>
            </>

         }
         {
            number === 5 && <GameOver pts={pts} />
         }
      </QuizWindow>
   )
}

export default Quiz
