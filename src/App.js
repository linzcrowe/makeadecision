import React, { Component } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Link
} from 'react-router-dom'
import Home from './components/Home';
import Decision from './components/Decision';
import NoMatch from './components/NoMatch';
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
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">
              <Link to='/'>
                Make a Decision!
              </Link>
            </h1>
            <p>To help the indecisive amongst us</p>
          </header>

          <Switch>
            <Route exact path="/" component={Home}/>
            <Route path="/decisions/:id" component={Decision} />
            <Route component={NoMatch}/>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
