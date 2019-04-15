import React, { Component } from 'react';
import TokenService from "../../services/token-service";
import config from '../../config';

class DashboardRoute extends Component {
  state = {
    language: null
  }
  
  getLangName(){
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
      this.setState({language: res.language.name})
    })
  }
  
  render() {
    this.getLangName();
    return (
      <section>
        <h2>{this.state.language}</h2>
          <h3>words to practice</h3>
            <li><h4>esp word</h4>
              correct answer count:
              incorrect answer count:
            </li>
        <button>start practicing</button>
      </section>
    );
  }
}

export default DashboardRoute
