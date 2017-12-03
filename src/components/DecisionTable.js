import React, { PureComponent } from 'react';
import firebase from 'firebase';
import Table,  {
  TableHead,
  TableBody,
  TableRow,
  TableCell
} from 'material-ui/Table';

export default class DecisionTable extends PureComponent {
  constructor() {
    super();
    this.state = {
      decisions: []
    }
  }

  componentWillMount() {
    firebase.firestore()
      .collection('decisions').get()
      .then(snapshot => {
        let rows = [];
        snapshot.forEach(decision => {
          console.log(decision.id, '=>', decision.data());
          rows.push((
              <TableRow key={decision.id}>
                <TableCell>
                  {decision.data().description}
                </TableCell>
              </TableRow>
            ));
        });
        this.setState({
          decisions: rows
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      })
  }

  render() {
    return (
      <div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Decisions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.decisions}
          </TableBody>
        </Table>
      </div>
    );
  }
}