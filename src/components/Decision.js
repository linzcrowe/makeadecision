import React, { PureComponent } from 'react';
import firebase from 'firebase';
import Table,  {
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from 'material-ui/Table';
import Button from 'material-ui/Button';

export default class Decision extends PureComponent {
  constructor(props) {
    super();
    this.decisionId = props.match.params.id;
    this.state = {
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
          description: snapshot.data().description,
          finalDecision: snapshot.data().finalDecision
        })
      })
  }

  getDecisionOptions() {
    // get and store the options
    firebase.firestore()
      .collection('decisions').doc(this.decisionId).collection('options').get()
      .then(decision => {
        console.log("got some options to go through: " + decision.size);
        let options = [];
        decision.forEach(option => {
          console.log(option.id, '=>', option.data());
          options.push({
            id: option.id,
            description: option.data().description
          });
        });
        this.setState({
          options: options
        });
      })

      .catch(err => {
        console.log('Error getting decision options', err);
      });
  }

  getDecisionVotes() {
    // get and store the votes
    firebase.firestore()
      .collection('decisions').doc(this.decisionId).collection('votes').get()
      .then(snapshot => {
        let votes = [];
        snapshot.forEach(vote => {
          console.log(vote.id, '=>', vote.data());
          votes.push({
            id: vote.id,
            option: vote.data().option
          });
        });
        this.setState({
          votes: votes
        });
      })
      .catch(err => {
        console.log('Error getting decision votes', err);
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
            { this.state.votes.filter(vote => vote.option === option.id).length }
          </TableCell>
          <TableCell>
            <Button>
              Vote
            </Button>
          </TableCell>
        </TableRow>
      );
    });

    return result;
  }

  getVotes(votes, optionId) {
    return votes.find(vote => vote.option === optionId);
  }

  componentWillMount() {
    this.getDecision();
    this.getDecisionOptions();
    this.getDecisionVotes();
  }

  render() {
    const rows = this.generateRows();
    console.log(rows);

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
      </div>
    );
  }
}