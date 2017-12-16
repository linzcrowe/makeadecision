import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import firebase from 'firebase';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';

export default class DecisionAdder extends PureComponent {
  constructor(props) {
    super();
    this.decisionId = null;
    this.state = {
      showButton: false,
      decisionText: "",
      addingDecision: false,
      decisionAdded: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onTextChanged = name => event => {
    console.log("onTextChanged: " + event.target.value);
    let showButton = false;
    if (event.target.value &&
      event.target.value.length > 0)
    {
      showButton = true; 
    }

    this.setState({
      showButton: showButton,
      decisionText: event.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const text = this.state.decisionText;
    this.setState({
      addingDecision: true,
      decisionText: ""
    });

    firebase.firestore()
      .collection('decisions')
      .add({
          description: text,
          finalDecision: "",
          notifyToEmail: "",
          timeConstraintMinutes: null,
        })
      .then(ref => {
        this.decisionId = ref.id;
        this.setState({
          decisionAdded: true,
          addingDecision: false,
        });
      });
  }

  render() {
    const divStyle = {
      padding: "0px 20px 0px 20px"
    }
    const spinnerStyle = {
      padding: "20px"
    }

    if (this.state.addingDecision) {
      return (
        <div>
          <CircularProgress style={spinnerStyle} />
        </div>);
    } else if (this.state.decisionAdded) {
      return (
        <Redirect to={'/decisions/' + this.decisionId} />
        );
    }

    return (
      <div>
        <h1>What do you need to decide?</h1>
        <form onSubmit={this.onSubmit}>
          <div style={divStyle}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Describe the decision you want to make"
              helperText="Create a new decision"
              margin="normal"
              fullWidth
              onChange={this.onTextChanged('name')}
              value={this.state.decisionText}
            />
          </div>
          <Button 
            display={this.state.showButton ? "initial" : "none"}
            type="submit">
            Add
          </Button>
        </form>
      </div>
    );
  }
}