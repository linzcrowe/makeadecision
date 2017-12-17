import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from 'material-ui/Button';

export default class DecisionLocker extends PureComponent {
  render() {
    return (
      <div>
        <Button primary onClick={this.props.lockdownDecision} >
          {this.props.label}
        </Button>
      </div>
    );
  }
}

DecisionLocker.propTypes = {
  lockdownDecision: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};
