import React, { Component } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import DecisionTable from './components/DecisionTable';
import './App.css';

class App extends Component {
  componentWillMount () {
    var config = {
      apiKey: "AIzaSyCv1up2u6s8zeY6gIwaqDMBNjeGv0Hko-s",
      authDomain: "make-a-decision.firebaseapp.com",
      databaseURL: "https://make-a-decision.firebaseio.com",
      projectId: "make-a-decision",
      storageBucket: "",
      messagingSenderId: "553714749301"
    };
    firebase.initializeApp(config);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Make a Decision!</h1>
          <p>Create a decision point, list the options, and get a decision!</p>
        </header>
        <p className="App-intro">
          Decisions in flight.
        </p>
        <DecisionTable />
      </div>
    );
  }
}

export default App;
