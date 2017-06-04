// createUser.jsx

import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

class CreateUser extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			cancelCreate: false,
			userCreated: false,
			logoutClick: false,
			returnHOme: false
		};

		this.homeClick				= this.homeClick.bind(this);
		this.handleLogOut 		= this.handleLogOut.bind(this);
		this.cancel 					= this.cancel.bind(this);
		this.zipChange 				= this.zipChange.bind(this);
		this.cityChange 			= this.cityChange.bind(this);
		this.emailChange 			= this.emailChange.bind(this);
		this.stateChange 			= this.stateChange.bind(this);
		this.handleSubmit 		= this.handleSubmit.bind(this);
		this.addressChange 		= this.addressChange.bind(this);
		this.usernameChange 	= this.usernameChange.bind(this);
		this.lastNameChange 	= this.lastNameChange.bind(this);
		this.firstNameChange 	= this.firstNameChange.bind(this);

	}

	cancel (e) {
		e.stopPropagation();
		this.setState({cancelCreate: true});
	}

	handleLogOut (e) {
    e.stopPropagation();
    axios.get('/logout')
    .then(response => {
      this.setState({logoutClick: true});
    });
  }

  homeClick (e) {
		e.stopPropagation();  	
		this.setState({returnHome: true});
	}
	
	handleSubmit (e) {
			e.stopPropagation();

			axios.post('/api/newuser', {
				username: 	this.state.username,
				password: 	'BH22escow',
				firstName: 	this.state.firstName,
				lastName: 	this.state.lastName,
				email: 			this.state.email,
				address: 		this.state.adddress,
				city: 			this.state.city,
				state: 			this.state.state,
				zip: 				this.state.zip
			})
			.then(response => {
				if (response.data.status === 'SUCCESS') {
					this.setState({userCreated: true});
				}
			});
	}

	usernameChange (e) {
		e.stopPropagation();
		e.preventDefault();		
		this.setState({username: e.target.value});
	}

	firstNameChange (e) {
		e.stopPropagation();		
		this.setState({firstName: e.target.value});
	}

	lastNameChange (e) {
		e.stopPropagation();		
		this.setState({lastName: e.target.value});
	}

	emailChange (e) {
		e.stopPropagation();		
		this.setState({email: e.target.value});
	}

	addressChange (e) {
		e.stopPropagation();		
		this.setState({address: e.target.value});
	}

	cityChange (e) {
		e.stopPropagation();		
		this.setState({city: e.target.value});
	}

	stateChange (e) {
		e.stopPropagation();		
		this.setState({state: e.target.value});
	}

	zipChange (e) {
		e.stopPropagation();		
		this.setState({zip: e.target.value});
	}


	render () {

		if (this.state.userCreated) {
			return (<Redirect to='/admin' />);
		}

		if (this.state.logoutClick) {
			return (<Redirect to='/' />)
		}

		if(this.state.returnHome) {
			return (<Redirect to='/api' />);
		}

		if (this.state.cancelCreate) {
			return (<Redirect to='/admin'/>);
		}

		return (
			<div className="container"> 
        <nav className="navbar navbar-default">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="">
                <img alt="Brand" src="img/updateUser.png" height="30px"/>
              </a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav">
                <li><a href="#" onClick={this.homeClick}>Home<span className="sr-only">(current)</span></a></li>
                <li><a href="#">Applications</a></li>
                <li className="active"><a href="#">Admin</a></li>
                <li><a href="#" onClick={this.handleLogOut}>Logout</a></li>                 
              </ul>
            </div>
          </div>
         </nav>

			<h2>Create User</h2>

			<label>Username</label>
			<input type="text" id="username" className="form-control" value={this.state.username} 
							onChange={this.usernameChange} required autoFocus></input>

			<label>First Name</label>
			<input type="text" id="firstname" className="form-control" value={this.state.firstName} 
							onChange={this.firstNameChange} required></input>

			<label>Last Name</label>
			<input type="text" id="lastname" className="form-control" value={this.state.lastName} 
							onChange={this.lastNameChange} required></input>

			<label>Email</label>
			<input type="text" id="email" className="form-control" value={this.state.email} 
							onChange={this.emailChange} required></input>

			<label>Address</label>
			<input type="text" id="address" className="form-control" value={this.state.address} 
							onChange={this.addressChange} required></input>

			<label>City</label>
			<input type="text" id="city" className="form-control" value={this.state.city} 
							onChange={this.cityChange} required></input>

			<label>State</label>
			<input type="text" id="state" className="form-control" value={this.state.state} 
							onChange={this.stateChange} required></input>

			<label>Zip</label>
			<input type="text" id="zip" className="form-control" value={this.state.zip} 
							onChange={this.zipChange} required></input>

			<Button bsStyle="primary" onClick={this.handleSubmit}>Create User</Button>
			<Button onClick={this.cancel}>Cancel</Button>

			</div>);
	}
}

module.exports = CreateUser;