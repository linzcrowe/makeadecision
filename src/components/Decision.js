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

export default class Decision extends PureComponent {
  constructor(props) {
    super();
    this.decisionId = props.match.params.id;
    this.state = {
      decisionLoaded: false,
      optionsLoaded: false,
      votesLoaded: false,
      description: '',
      finalDecision: '',
      options: [],
      votes: []
    }
  }

  getDecision() {
    firebase.firestore()
      .collection('decisions').doc(this.decisionId).get()
      .then(snapshot => {
        this.setState({
          decisionLoaded: true,
          description: snapshot.data().description,
          finalDecision: snapshot.data().finalDecision
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
      // .catch(err => {
      //   console.log('Error getting decision votes', err);
      // });
  }

  castVote(option) {
    firebase.firestore().collection('decisions').doc(this.decisionId).collection('votes')
      .add({
          optionId: option
        })
      .then(ref => {
        console.log('Added document with ID: ', ref.id);
      });
  }

  generateRows(options) {
    let result = [];

    this.state.options.forEach(option => {
      result.push(
        <TableRow key={option.id}>
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
            <Button raised color="primary" onClick={() => this.castVote(option.id)}>
              Vote
            </Button>
          </TableCell>
        </TableRow>
      );
    });

    return result;
  }

  componentWillMount() {
    this.getDecision();
    this.getDecisionOptions();
    this.getDecisionVotes();
  }

  render() {
    if (!this.state.decisionLoaded || 
        !this.state.optionsLoaded || 
        !this.state.votesLoaded) {
      const s = {
        padding: "20px"
      }
      return (
        <div>
          <CircularProgress style={s} />
        </div>);
    } else {
      return (
        <div>
          <h1>{this.state.description}</h1>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  Option
                </TableCell>
                <TableCell>
                  Votes
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              { this.generateRows() }
            </TableBody>
          </Table>
          <OptionAdder decisionId={this.decisionId} />
        </div>
      );
    }
  }
}