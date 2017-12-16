import React, { PureComponent } from 'react';
import DecisionTable from './DecisionTable';
import DecisionAdder from './DecisionAdder';

export default class Home extends PureComponent {
  render() {
    return (
      <div>
        <DecisionAdder />
        <p className="App-intro">
          Decisions in flight.
        </p>
        <DecisionTable />
      </div>
    );
  }
}