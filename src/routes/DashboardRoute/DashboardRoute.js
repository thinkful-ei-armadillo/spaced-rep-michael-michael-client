import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TokenService from "../../services/token-service";
import config from '../../config';

class DashboardRoute extends Component {
  state = {
    language: {
      id: null,
      name: null,
      user_id: null,
      head: null,
      total_score: null
    },
    words: []
  }

  componentDidMount(){
    this.getLangWords();
  }

  getLangWords(){
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
        language: {
          id: res.language.id,
          name: res.language.name,
          user_id: res.language.user_id,
          head: res.language.head,
          total_score: res.language.total_score
        }
      })
      this.setState({words: res.words})
    })
  }

  render() {
    const wordMap = this.state.words.map((word) => {
      return (
        <li key={word.id}><h4>{word.original}</h4>
          Right: {word.correct_count}
          <br />
          Wrong: {word.incorrect_count}</li>)
    })
    return (
      <section className="dashboard">
        <h2>{this.state.language.name}</h2>
        <p>Total Correct Answers: {this.state.language.total_score}</p>
        <h3>Words to Practice:</h3>
        <ul>
          {wordMap}
        </ul>
        <Link to="/learn">
          <button>Start Practicing</button>
        </Link>
      </section>
    );
  }
}

export default DashboardRoute;
