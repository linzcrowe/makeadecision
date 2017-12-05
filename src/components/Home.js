import React, { PureComponent } from 'react';
import DecisionTable from './DecisionTable';

export default class Home extends PureComponent {
  render() {
    return (
      <div>
        <p className="App-intro">
          Decisions in flight.
        </p>
        <DecisionTable />
      </div>
    );
  }
}