import React, { PureComponent } from 'react';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import PropTypes from 'prop-types';

export default class DecisionMaker extends PureComponent {
  static findMostVoted(options, votes) {
    const summarised = [];

    // just one option, it wins
    if (options.length === 1) {
      return options[0];
    }

    const selectAtRandom = numOptions => Math.floor(Math.random() * (numOptions + 1));

    // no votes, pick a random winner
    if (votes.length === 0) {
      return options[selectAtRandom(options.length)];
    }

    options.forEach((option) => {
      const numVotes = votes.filter(vote => vote === option).length;
      summarised.push({
        option,
        numVotes,
      });
    });

    // all options have the same votes, so pick at random
    if (summarised.every(item => item.numVotes === summarised[0].numVotes)) {
      return options[selectAtRandom(options.length)];
    }

    const voteNumbers = summarised.map(item => item.numVotes);
    const maxVotes = Math.max(voteNumbers);
    const topVoted = summarised.filter(item => item.numVotes === maxVotes);

    // 1 clear winner
    if (topVoted.length === 1) {
      return topVoted[0];
    }
    // multiple potential winners, so pick at random
    return topVoted[selectAtRandom(options.length)];
  }

  constructor(props) {
    super(props);
    this.makeDecision = this.makeDecision.bind(this);
  }

  /*
    Can only be called once there are options to choose from.
    Throws an exception if none available.
  */
  makeDecision() {
    if (this.props.options.length === 1) {
      this.props.onMakeDecision(this.props.options[0]);
    } else {
      const optionIds = this.props.options.map(option => option.id);
      const votesByOptionId = this.props.votes.map(vote => vote.option);

      this.props.onMakeDecision(this.findMostVoted(optionIds, votesByOptionId));
    }
  }

  render() {
    return (
      <div>
        <span>Decide&nbsp;&nbsp;</span>
        <Select value={0}>
          <MenuItem value={0}>
            now
          </MenuItem>
          <MenuItem value={10}>
            in 10 minutes
          </MenuItem>
          <MenuItem value={30}>
            in 30 minutes
          </MenuItem>
          <MenuItem value={60}>
            in 1 hour
          </MenuItem>
        </Select>
        <Button onClick={this.makeDecision}>
          Go!
        </Button>
      </div>
    );
  }
}

DecisionMaker.propTypes = {
  onMakeDecision: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  votes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};
