//homePage.jsx
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.state = {loggedIn: true};
  } 

  handleLogOut () {
    axios.get('/logout')
    .then(response => {
      this.setState({loggedIn: false});
    });
  }

  handleAddUser () {
    axios.post('/adduser', 
      { username: 'john.adams@example.com',
        password: 'BH22escow',
        firstname: 'John',
        lastname: 'Adams'
    })
    .then(response => {
      if(response.data.status === 'ERROR') {
        console.log('error');
      } else if (response.data.status === 'SUCCESS') {
        console.log('added users');
      }
    });

  }

  render() {

      if (this.state.loggedIn) {
        return ( 
          <div>
            <h2>Welcome To The HomePage</h2>
            <button onClick={this.handleLogOut}>Log Out</button>
            <div className="addUser" onClick={this.handleAddUser}>
              Add User
            </div>
          </div>
        );
        } 

        return (
          <Redirect to='/' />
          );

  } 

}

module.exports = HomePage;