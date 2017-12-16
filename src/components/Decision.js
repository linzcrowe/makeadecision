import React, { PureComponent } from 'react';
import firebase from 'firebase';
import Table,  {
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from 'material-ui/Table';
import Button from 'material-ui/Button';
import OptionAdder from './OptionAdder';
import { CircularProgress } from 'material-ui/Progress';
import IconButton from 'material-ui/IconButton';
import DeleteIcon from 'material-ui-icons/Delete';
import DecisionMaker from './DecisionMaker';
import DecisionLocker from './DecisionLocker';

export default class Decision extends PureComponent {
  constructor(props) {
    super();
    this.decisionId = props.match.params.id;
    this.statuses = {
      addingOptions: 'adding-options',
      openToVoting: 'open-to-voting',
      decisionMade: 'decision-made',
    }
    this.state = {
      decisionLoaded: false,
      optionsLoaded: false,
      votesLoaded: false,
      description: '',
      finalDecision: '',
      options: [],
      votes: [],
      status: this.statuses.addingOptions,
    }
    this.castVote = this.castVote.bind(this);
    this.deleteOption = this.deleteOption.bind(this);
    this.lockdownDecision = this.lockdownDecision.bind(this);
    this.makeDecision = this.makeDecision.bind(this);
  }

  getDecision() {
    firebase.firestore()
      .collection('decisions').doc(this.decisionId)
      .onSnapshot(snapshot => {
        this.setState({
          decisionLoaded: true,
          description: snapshot.data().description,
          finalDecision: snapshot.data().finalDecision,
          status: (snapshot.data().status ? 
                  snapshot.data().status : 
                  this.statuses.addingOptions),
        });
      })
  }

  getDecisionOptions() {
    // get and store the options
    firebase.firestore()
      .collection('decisions').doc(this.decisionId).collection('options')
      .onSnapshot(decision => {
        let options = [];
        decision.forEach(option => {
          options.push({
            id: option.id,
            description: option.data().description
          });
        });
        this.setState({
          optionsLoaded: true,
          options: options
        });
      })
  }

  getDecisionVotes() {
    // get and store the votes
    firebase.firestore()
      .collection('decisions').doc(this.decisionId).collection('votes')
      .onSnapshot(snapshot => {
        let votes = [];

        snapshot.forEach(vote => {
          votes.push({
            id: vote.id,
            option: vote.data().optionId
          });
        });
        this.setState({
          votesLoaded: true,
          votes: votes
        });
      })
  }

  castVote(option) {
    firebase.firestore().collection('decisions').doc(this.decisionId).collection('votes')
      .add({
          optionId: option
        })
      .catch(error => {
        console.log('Failed to cast vote', error);
      });
  }

  deleteOption(option) {
    firebase.firestore()
      .collection('decisions')
      .doc(this.decisionId)
      .collection('options')
      .doc(option)
      .delete();
  }

  generateTableContents(options) {
    let tableHead = null;
    let tableBodyRows = [];
    let winnerStyle = {
      fontWeight:'bold',
    };
    let loserStyle = {
      color:'gray',
    }

    switch (this.state.status) {
      case this.statuses.addingOptions:
        tableHead = (
          <TableHead>
            <TableRow>
              <TableCell /> {/* Delete button column */}
              <TableCell>
                Option
              </TableCell>
            </TableRow>
          </TableHead>);

        this.state.options.forEach(option => {
          tableBodyRows.push(
            <TableRow 
              key={option.id}>
              <TableCell>
                <IconButton 
                  aria-label="Delete" 
                  onClick={() => this.deleteOption(option.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
              <TableCell>
                {option.description}
              </TableCell>
            </TableRow>
          );
        });
        break;

      case this.statuses.openToVoting:
        tableHead = (
          <TableHead>
            <TableRow>
              <TableCell>
                Option
              </TableCell>
              <TableCell>
                Votes
              </TableCell>
              <TableCell /> {/* vote button row */}
            </TableRow>
          </TableHead>);

        this.state.options.forEach(option => {
          tableBodyRows.push(
            <TableRow
              key={option.id}>
              <TableCell>
                {option.description}
              </TableCell>
              <TableCell>
                { this.state.votes.filter(vote => {
                    return vote.option === option.id;
                  }).length
                }
              </TableCell>
              <TableCell>
                <Button color="primary" onClick={() => this.castVote(option.id)}>
                  Vote
                </Button>
              </TableCell>
            </TableRow>
          );
        });
        break;

      case this.statuses.decisionMade:
        tableHead = (
          <TableHead>
            <TableRow>
              <TableCell>
                Option
              </TableCell>
              <TableCell>
                Votes
              </TableCell>
            </TableRow>
          </TableHead>);

        this.state.options.forEach(option => {
          let textStyle = {};
          if (this.state.finalDecision) {
            if (this.state.finalDecision === option.id) {
              textStyle = winnerStyle;
            } else {
              textStyle = loserStyle;
            }
          }

          tableBodyRows.push(
            <TableRow 
              key={option.id}>
              <TableCell
                style={textStyle} 
                >
                {option.description}
              </TableCell>
              <TableCell
                style={textStyle}
                >
                { this.state.votes.filter(vote => {
                    return vote.option === option.id;
                  }).length
                }
              </TableCell>
            </TableRow>
            );
        });
        break;
      default:
        break;
    }

    return (
      <Table>
        {tableHead}
        <TableBody>
          {tableBodyRows}
        </TableBody>
      </Table>);
  }

  componentWillMount() {
    this.getDecision();
    this.getDecisionOptions();
    this.getDecisionVotes();
  }

  lockdownDecision() {
    firebase.firestore()
      .collection('decisions')
      .doc(this.decisionId)
      .set({
          status: this.statuses.openToVoting,
        }, { 
          merge: true 
        });
  }

  makeDecision(winner) {
    firebase.firestore()
      .collection('decisions')
      .doc(this.decisionId)
      .set({
          finalDecision: winner.id,
          status: this.statuses.decisionMade,
        }, { 
          merge: true 
        });
  }

  render() {
    if (!this.state.decisionLoaded || 
        !this.state.optionsLoaded || 
        !this.state.votesLoaded) {
      const circularProgressStyle = {
        padding: "20px"
      }
      return (
        <div>
          <CircularProgress style={circularProgressStyle} />
        </div>);
    } else {
      return (
        <div>
          <h1>{this.state.description}</h1>
          <Table>
            {this.generateTableContents()}
          </Table>
          {this.state.status === this.statuses.addingOptions && 
          <OptionAdder 
            decisionId={this.decisionId}
            options={this.state.options}
            votes={this.state.votes} />
          }
          {this.state.status === this.statuses.addingOptions && 
          <DecisionLocker
            lockdownDecision={this.lockdownDecision}>
            Open to votes
          </DecisionLocker>
          }
          {this.state.status === this.statuses.openToVoting &&
          <DecisionMaker
            onMakeDecision={this.makeDecision}
            options={this.state.options}
            votes={this.state.votes}
            decisionId={this.decisionId} />
          }
        </div>
      );
    }
  }
}