import React, { PureComponent } from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import firebase from 'firebase';

export default class OptionAdder extends PureComponent {
  constructor(props) {
    super();
    this.state = {
      showButton: false,
      optionText: ""
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
      optionText: event.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const text = this.state.optionText;
    firebase.firestore()
      .collection('decisions')
      .doc(this.props.decisionId)
      .collection('options')
      .add({
          description: text,
        });
    this.setState({
      optionText: ""
    })
  }

  render() {
    const divStyle = {
      padding: "0px 20px 0px 20px"
    }

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <div style={divStyle}>
            <TextField
              InputLabelProps={{
                shrink: true,
              }}
              placeholder="Describe the option"
              helperText="Add a new option"
              margin="normal"
              fullWidth
              onChange={this.onTextChanged('name')}
              value={this.state.optionText}
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