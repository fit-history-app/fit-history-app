import React, { useState } from 'react';
import './main.css';
import Start from './components/Start'
import Quiz from './components/Quiz'

function Trivia() {

   const [start, setStart] = useState(false);

   return (
      <div className="Trivia">

         <header className="Trivia-header">
            <div className="quiz">
               {start ? <Quiz /> : <Start props={setStart} />}
            </div>
         </header>

      </div>
   );
}

export default Trivia;
