import React, { Component } from 'react';
import TokenService from "../../services/token-service";
import config from '../../config';

class LearningRoute extends Component {
  
  state = {
    total_score: null
  }

  componentDidMount (){
    this.getTotalScore();
  }

  getTotalScore(){
    fetch(`${config.API_ENDPOINT}/language`, {
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
        
          total_score: res.language.total_score
        
      })
      
    })
  }

  

  render() {
    
    return (
      <section>
        <h2>Translate The Word</h2>
        <span>Beber</span>
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
        <p>You have answered this word correctly 10 times</p>
        <p>You have answered this word incorrectly 20 times</p>
        
        </div>


      </section>
    );
  }
}

export default LearningRoute
