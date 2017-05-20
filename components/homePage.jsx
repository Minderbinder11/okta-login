//homePage.jsx
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.state = {loggedIn: true}
  } 

  handleLogOut () {
    axios.get('/logout')
    .then(response => {

      console.log('Logged out')
      this.setState({loggedIn: false});

    })

  }

  render() {

      if (this.state.loggedIn) {
        return ( 
          <div>
            <h2>Welcome Home</h2>
            <button onClick={this.handleLogOut}>Log Out</button>
          </div>
        );
        } 

        return (
          <Redirect to='/' />
          );

  } 

}

module.exports = HomePage;