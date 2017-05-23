//homePage.jsx
import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import AppLink from './appLink.jsx';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.state = {
      loggedIn: true,
      apps: []
    };
  } 

  componentDidMount() {

    axios.get('/applinks')
    .then(response => {
      this.setState({apps: response.data})
    });

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

    console.log(this.state.apps)
    var apps = this.state.apps;

      if (this.state.loggedIn) {
        return ( 
          <div>
            <h2>Welcome To The HomePage</h2>
            <button onClick={this.handleLogOut}>Log Out</button>
            <div className="addUser" onClick={this.handleAddUser}>
              Add User
            </div>
            <ul>
              {apps.map((app) => {
                return (<AppLink app={app} key={app.id}/>);
            })}
              </ul>
          </div>
        );
        } 

        return (
          <Redirect to='/' />
          );

  } 

}

module.exports = HomePage;