//homePage.jsx
import React from 'react';
import axios from 'axios';
import AppLink from './appLink.jsx';
import { Link, Redirect } from 'react-router-dom';


class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedIn: true,
      admin: false,
      adminRedirect: false,
      apps: [],
      firstName: '',
      lastName: '',


    };
    this.adminRedirect = this.adminRedirect.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  } 

  componentDidMount() {

    axios.get('/api/getCurrentUser')
    .then( response => {
      this.setState({
        firstName:  response.data.user.profile.firstName,
        lastName:   response.data.user.profile.lastName,
        login:      response.data.user.profile.login
      });
    });

    axios.get('/api/applinks')
    .then(response => {
      console.log('apps: ', response.data);
      this.setState({apps: response.data})
    });

    axios.get('/api/groups')
    .then(response => {
      console.log('group response: ', response);
      if (response.data.status === 'admin') {
        this.setState({isAdmin: true});
        console.log('is admin', this.state.isAdmin);
      } else {
        console.log('not an admin');
      }
    });
  }

  adminRedirect (e) {
    e.stopPropagation();
    this.setState({adminRedirect: true})
  }

  handleLogOut (e) {
    e.stopPropagation();
    axios.get('/logout')
    .then(response => {
      this.setState({loggedIn: false});
    });
  }

  render() {

    var apps = this.state.apps;

    if(this.state.adminRedirect) {
     return  <Redirect to="/admin" />
    }

    if (this.state.loggedIn) {
      return ( 
        <div className="container">

          <nav className="navbar navbar-default">
             <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    { this.state.isAdmin && <span className="icon-bar"></span> }
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="">
                    <img src="img/updateUser.png" height="30"/>
                  </a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li className="active"><a href="#">Home<span className="sr-only">(current)</span></a></li>
                    <li><a href="#">Applications</a></li>
                    { this.state.isAdmin && <li><a href="#" onClick={this.adminRedirect}>Admin</a></li> }
                    <li><a href="#" onClick={this.handleLogOut}>Logout</a></li>                 
                  </ul>
                </div>
              </div>
          </nav>

          <h3>{this.state.firstName} {this.state.lastName} </h3>
          <h2> You have {apps.length} available</h2>
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