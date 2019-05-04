import React, { Component } from 'react';
import TokenService from "../../services/token-service";
import config from '../../config';
import './LearningRoute.css';


class LearningRoute extends Component {
  
  state = {
    total_score: null,
    word: {
      id: null,
      original: null,
      translation: null,
      correct_count: 0,
      incorrect_count: 0
    },
    nextWord: {},
    guess: '',
    isCorrect: null
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
      console.log(res);
      this.setState({
          total_score: res.language ? res.language.total_score : res.totalScore,
          word: Array.isArray(res.nextWord) ? res.nextWord[0] : {
            original: res.nextWord,
            correct_count: res.wordCorrectCount,
            incorrect_count: res.wordIncorrectCount
          }
      })
    })
  }

  showWord(){
    return(
        <span><i>{this.state.word.original}</i></span>
    )
  }

  showCounts(){
    return(
      <div className="wordCounts">
          You have answered this word correctly {this.state.word.correct_count} times.
          <br />
          You have answered this word incorrectly {this.state.word.incorrect_count} times.
      </div>
    )
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
    const stateGuess = this.state.guess;
    fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "Authorization": `Bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({ guess: stateGuess })
    })
    .then(res => {
      if(!res.ok){
        return 'error';
      }
      return res.json();
    })
    .then(res => {
      this.setState({
        total_score: res.totalScore,
        nextWord: {
          original: res.nextWord,
          correct_count: res.wordCorrectCount,
          incorrect_count: res.wordIncorrectCount
        },
        isCorrect: res.isCorrect
      })
      this.showResults();
    })
  }

  changeWord(){
    this.setState({
      word: {
        id: this.state.nextWord.original.id,
        original: this.state.nextWord.original.original,
        translation: this.state.nextWord.original.translation,
        correct_count: this.state.nextWord.original.correct_count,
        incorrect_count: this.state.nextWord.original.incorrect_count
      },
      isCorrect: null
    })
  }

  showResults(){
    if(this.state.isCorrect === true){
      return(
        <div className="DisplayFeedback">
          <h2>You got it right!</h2>
          <p>The answer was {this.state.guess}</p>
          <p>The next word is {this.state.nextWord.original.original}</p>
          <button type="button" onClick={() => this.changeWord()}>Next Word</button>
        </div>
      )
    }
    if(this.state.isCorrect === false){
      return(
        <div className="DisplayFeedback">
          <h2>You got it wrong.</h2>
          <p>The correct translation for {this.state.word.original} was {this.state.word.translation} and you chose {this.state.guess}</p>
          <button type="button" onClick={() => this.changeWord()}>Next Word</button>
        </div>
      )
    }
    if(this.state.isCorrect === null){
      return;
    }
  }

  displaySubmitBtn(){
    if(this.state.isCorrect === null){
      return (<button type='submit'>Submit Your Guess</button>)
    }
    if(this.state.isCorrect === true || this.state.isCorrect === false){
      return null;
    }
  }

  render() {
    return (
      <section className="learning-page">
        <h2>Translate The Word:</h2>
        {this.showWord()}
        <div className="DisplayScore">
          <p>Total Score: {this.state.total_score}</p>
        </div>
        {this.showCounts()}
        <form onSubmit={(e) => {this.handleGuess(e)}}>
          <fieldset>
            <label htmlFor='learn-guess-input'>What's the translation for this word?</label>
            <input type='text' name='learn-guess-input' id='learn-guess-input' onChange={this.handleChange} required></input>
          </fieldset>
          {this.displaySubmitBtn}
        </form>
        {this.showResults()}
      </section>
    );
  }
}

export default LearningRoute;
