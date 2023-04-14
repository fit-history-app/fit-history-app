import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from "./Button";
import GameOver from './GameOver';
import my_trivia from './../../../data/trivia_questions.json';

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

const Question = styled.div`
    width: 70%;
    margin: 0 auto;
`;

const Quiz = () => {

   const [quiz, setQuiz] = useState([]);
   const [number, setNumber] = useState(0);
   const [pts, setPts] = useState(0); 

   const shuffle = (arr) => arr.sort(() => (Math.random() > .5) ? 1 : -1);

   const pickAnswer = (e) => {

      let userAnswer = e.target.outerText;

      if (quiz[number].answer === userAnswer) setPts(pts + 1);
      setNumber(number + 1);
   }

   useEffect(() => {
      var questions = shuffle(my_trivia.questions).slice(0,5);
      

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
                     <Button key={index} dangerouslySetInnerHTML={{ __html: item }} onClick={pickAnswer}></Button>
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
