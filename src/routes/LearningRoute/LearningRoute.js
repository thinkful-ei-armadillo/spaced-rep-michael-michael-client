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
      this.setState({
          total_score: res.language.total_score,
          word: res.nextWord[0]
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
        <p>
          You have answered this word correctly {this.state.word.correct_count} times.
        </p>
        <p>
          You have answered this word incorrectly {this.state.word.incorrect_count} times.
        </p>
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
        <div className="results">
          <h2>You got it right!</h2>
          <p>The answer was {this.state.guess}</p>
          <p>The next word is {this.state.nextWord.original.original}</p>
          <button type="button" onClick={() => this.changeWord()}>Next Word</button>
        </div>
      )
    }
    if(this.state.isCorrect === false){
      return(
        <div className="results">
          <h2>You got it wrong.</h2>
          <p>The answer was {this.state.word.translation}</p>
          <button type="button" onClick={() => this.changeWord()}>Next Word</button>
        </div>
      )
    }
    if(this.state.isCorrect === null){
      return;
    }
  }

  render() {
    return (
      <section className="learning-page">
        <h2>Translate The Word:</h2>
        {this.showWord()}
        {this.showCounts()}
        <p>Total Score: {this.state.total_score}</p>
        <form onSubmit={(e) => {this.handleGuess(e)}}>
          <fieldset>
            <label htmlFor='nextword'>What's the translation for this word?</label>
            <input type='text' name='nextword' id="userGuess" onChange={this.handleChange} required></input>
          </fieldset>
          <button type='reset'>Reset</button>
          <button type='submit'>Submit Your Guess</button> {/* if isCorrect !== null, disable button */}
        </form>
        {this.showResults()}
      </section>
    );
  }
}

export default LearningRoute;
