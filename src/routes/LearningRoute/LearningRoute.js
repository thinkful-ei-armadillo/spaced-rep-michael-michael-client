import React, { Component } from 'react';
import TokenService from "../../services/token-service";
import config from '../../config';

class LearningRoute extends Component {
  
  state = {
    total_score: null,
    words: [{
      id: null,
      original: null,
      translation: null,
      correct_count: 0,
      incorrect_count: 0
    }],
    currentWord: 1,
    guess: ''
  }

  componentDidMount (){
    this.getWords();
  }

  getWords(){
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
          words: res.nextWord,
      })
    })
  }

  showWord(){
    for(let i = (this.state.currentWord - 1); i < this.state.currentWord; i++){
      return(
        <div className="currentWord">
          <span>{this.state.words[i].original}</span>
          <p>
            You have answered this word correctly {this.state.words[i].correct_count} times.
          </p>
          <p>
            You have answered this word incorrectly {this.state.words[i].incorrect_count} times.
          </p>
        </div>
      )
    }
  }

  handleChange = e => {
    e.preventDefault();
    console.log(e.target.value);
    this.handleState(e.target.value);
  }

  handleState(guess){
    this.setState({guess: guess});
  }

  handleGuess = e => {
    e.preventDefault();
    if(this.state.words[this.state.currentWord - 1].translation === this.state.guess){
      console.log('CORRECT')
      fetch(`${config.API_ENDPOINT}/language/guess`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${TokenService.getAuthToken()}`
        },
        body: {
          word: this.state.words[this.state.currentWord - 1].id,
          guess: 'correct'
        }
      })
      .then(res => {
        if(!res.ok){
          return 'error';
        }
        return res.json();
      })
      .then(res => {
        console.log(res)
      })
    }
    else{
      console.log('INCORRECT')
    }
    
    // cycle through the array of words:
    // let nextWord = this.state.currentWord + 1;
    // if(nextWord <= this.state.words.length){
    //   this.setState({currentWord: nextWord});
    // }
    // else{
    //   this.setState({currentWord: 1})
    // }
  }

  render() {
    return (
      <section>
        <h2>Translate The Word:</h2>
        {this.showWord()}
        <p>Total Score: {this.state.total_score}</p>
        <form onSubmit={(e) => {this.handleGuess(e)}}>
          <fieldset>
            <label htmlFor='nextword'>What's the translation for this word?</label>
            <input type='text' name='nextword' id="userGuess" onChange={this.handleChange} required></input>
          </fieldset>
          <button type='reset'>Reset</button>
          <button type='submit'>Submit Your Guess</button>
        </form>
      </section>
    );
  }
}

export default LearningRoute;
