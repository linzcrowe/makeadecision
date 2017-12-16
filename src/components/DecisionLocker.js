import React, { PureComponent } from 'react';
import Button from 'material-ui/Button';

export default class DecisionLocker extends PureComponent {
  render() {
    return (
      <div>
        <Button primary onClick={this.props.lockdownDecision} >
          {this.props.children}
        </Button>
      </div>
    );
  }
}