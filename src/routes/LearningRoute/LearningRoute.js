import React, { Component } from 'react';
import TokenService from "../../services/token-service";
import config from '../../config';

class LearningRoute extends Component {
  
  state = {
    total_score: null,
    nextWord: [
      {
        original: null,
        correct_count: null,
        incorrect_count: null,
      }
  
    ]
    
  }

  componentDidMount (){
    // this.getTotalScore();
    this.getNextWord();
    // this.fakeWord();
  }

  // getTotalScore(){
  //   fetch(`${config.API_ENDPOINT}/language/head`, {
  //     method: "GET",
  //     headers: {
  //       "content-type": "application/json",
  //       "Authorization": `Bearer ${TokenService.getAuthToken()}`
  //     }
  //   })
  //   .then(res => {
  //     if(!res.ok){
  //       return 'error';
  //     }
  //     return res.json();
  //   })
  //   .then(res => {
  //     this.setState({
        
  //         total_score: res.language.total_score
        
  //     })
      
  //   })
  // }

  getNextWord(){
    fetch(`${config.API_ENDPOINT}/language/head`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${TokenService.getAuthToken()}`
      }
    })
    .then(res => {
      if(!res.ok){
        return 'error';
      }
      return res.json();
    })
    .then(res => {
      this.setState({
        
          total_score: res.language.total_score,
          nextWord: res.nextWord,
          
        
      })
      //  console.log(this.state.nextWord);
      //  console.log(this.state.nextWord[0].original);
    })

  }

  
  



  render() {
    
    
   

     const newWord  = this.state.nextWord;

    // console.log(newWord);
    
    return (
      <section>
        <h2>Translate The Word:</h2>
        <span>Andar</span>
        <p>Your total score is {this.state.total_score}</p>
        <form>
        <fieldset>
         <label htmlFor='nextword'>What's the translation for this word?</label>
         <input type='text' name='nextword' required></input>
        </fieldset>
        <button type='reset'>Reset</button>
        <button type='submit'>Submit your answer</button>
        </form>
        <div className='word-results'>
        <p>You have answered this word correctly {newWord[0].correct_count} times</p>
        <p>You have answered this word incorrectly {newWord[0].incorrect_count} times</p>
        
        </div>


      </section>
    );
  }
}

export default LearningRoute
