import React, { PureComponent } from 'react';
import Button from 'material-ui/Button';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';

export default class DecisionMaker extends PureComponent {
  constructor(props) {
    super(props)
    this.makeDecision = this.makeDecision.bind(this);
  }

  canDecisionBeMade() {
    if (!this.props.options || this.props.options.length === 0) {
      return false;
    }
    return true;
  }

  findMostVoted(options, votes) {
    let winner = null;
    let summarised = [];

    options.forEach(option => {
      let numVotes = votes.filter(vote => vote === option).length;
      summarised.push({
        option,
        numVotes,
      });
    });

    if (summarised.every(item => item.numVotes === summarised[0].numVotes)) {
      return options[Math.random() * (options.length + 1)];
    }

    let voteNumbers = summarised.map(item => item.numVotes);
    let maxVotes = Math.max(voteNumbers);
    // count if more than 1 has max votes
    // if no, find the top voted and return as winner
    // if yes, get all that are equal and use rand again

    summarised.forEach(option => {
      if (option.numVotes > summarised[0].numVotes) {
        winner = option.option;
      }
    });

    return winner;
  }

  makeDecision() {
    if (!this.canDecisionBeMade()) {
      console.log("Cannot make decision");
      return;
    }

    if (this.props.options.length === 1) {
      return this.props.options[0];
    }

    let optionIds = this.props.options.map(option => option.id);
    let votesByOptionId = this.props.votes.map(vote => vote.option);

    return this.findMostVoted(optionIds, votesByOptionId);

    if (this.props.options.length > 1) {
      let summarised = [];
      this.props.options.forEach(option => {
        let numVotes = this.props.votes.filter(vote => vote.option === option.id).length;
        summarised.push({
          option,
          numVotes,
        });
      });

      let allTheSame = summarised.every(item => item.numVotes === summarised[0].numVotes);
      if (allTheSame) {
        // all the same number of votes, so we pick randomly
        winner = Math.random() * (summarised.length + 1);
      } else {
        summarised.forEach(option => {
          if (option.numVotes > summarised[0].numVotes) {
            winner = option.option;
          }
        });
      }
    }

    this.props.onMakeDecision(winner);
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