import React, { useState } from 'react';
import '../../styles/trivia.css';
import Start from './components/Start'
import Quiz from './components/Quiz'

function Trivia() {

   const [start, setStart] = useState(false);

   return (
      <div className="Trivia">

         <header className="Trivia-header">
         <div className='header'>
            <h2>FL Tech History Tours</h2>
            <div>
               <ul className='menuBar'>
                  <li>
                     <div className='itemContainer' id='games'>
                        <button className='menuItem'>Games</button>
                        <div className='subMenuItem'>
                           <p>Scavenger Hunt</p>
                           <p><a href="/trivia">History Trivia</a></p>
                        </div>
                     </div>
                  </li>
                  <li>
                     <div className='itemContainer' id='sharing'>
                        <button className='menuItem'>Social</button>
                        <div className='subMenuItem'>
                           <a href="https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer%2Fsharer.php%3Fkid_directed_site%3D0%26u%3Dhttps%253A%252F%252Ffit-history-tours.live%252F%26display%3Dpopup%26ref%3Dplugin%26src%3Dshare_button&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=en_US&kid_directed_site=0">
                              <img src="facebook_svg_icon.svg" alt="Facebook" />
                           </a>
                           <a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-show-count="false">
                              
                              <img src="twitter_svg_icon.svg" alt="Twitter" />
                              </a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
                        </div>
                     </div>
                  </li>
               </ul>
            </div>
         </div>
            <div className="quiz">
               {start ? <Quiz /> : <Start props={setStart} />}
            </div>
         </header>

      </div>
   );
}

export default Trivia;
