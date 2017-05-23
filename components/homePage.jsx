//homePage.jsx
import React from 'react';
import axios from 'axios';
import AppLink from './appLink.jsx';
import { Link, Redirect } from 'react-router-dom';


class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.state = {
      loggedIn: true,
      admin: false,
      apps: []
    };
  } 

  componentDidMount() {
    axios.get('/api/applinks')
    .then(response => {
      this.setState({apps: response.data})
    });

    axios.get('/api/groups')
    .then(response => {
      console.log(response);
      if (response.data.status === 'admin') {
        this.setState({isAdmin: true});
        console.log('is admin', this.state.isAdmin);
      }
    });
  }

  handleLogOut (e) {
    e.stopPropagation();
    axios.get('/logout')
    .then(response => {
      console.log('in logout promise')
      this.setState({loggedIn: false});
    });
  }

  handleAddUser (e) {
    e.stopPropagation();
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
            { this.state.isAdmin && 
              <div>
              Does this show up???
              <Link to="/admin">Admin</Link>
              </div>
            }
          </div>
        );
        } 

        return (
          <Redirect to='/' />
          );

  } 

}

module.exports = HomePage;