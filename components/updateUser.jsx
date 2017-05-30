// updateUser.jsx

import React from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class UpdateUser extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userUpdated: false,
			logoutClick: false,
			returnHome: false,
			cancelUpdate: false,
			userId: this.props.match.params.userId,
		};

		this.homeClick = this.homeClick.bind(this);
		this.handleLogOut 	= this.handleLogOut.bind(this);		
		this.handleCancel = this.handleCancel.bind(this);
		this.zipChange = this.zipChange.bind(this);
		this.cityChange = this.cityChange.bind(this);
		this.emailChange = this.emailChange.bind(this);
		this.stateChange = this.stateChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addressChange = this.addressChange.bind(this);
		this.usernameChange = this.usernameChange.bind(this);
		this.lastNameChange = this.lastNameChange.bind(this);
		this.firstNameChange = this.firstNameChange.bind(this);

	}

	componentDidMount () {

		axios.get('/api/getUser/' + this.props.match.params.userId)
		.then(response => {
			var user = response.data.user;
			user = JSON.parse(user);
			
			this.setState({
				userUpdated: 		false,
				userId: 				user.id,
				login: 					user.profile.login,
				firstName: 			user.profile.firstName,
				lastName: 			user.profile.lastName,
				email: 					user.profile.email,
				streetAddress: 	user.profile.streetAddress,
				city: 					user.profile.city,
				state: 					user.profile.state,
				zipCode: 				user.profile.zipCode
			});
		});
	}

	homeClick (e) {
		e.stopPropagation();		
		this.setState({returnHome: true});
	}

	handleCancel (e) {
		e.stopPropagation();
		this.setState({cancelUpdate: true});
	}

	handleLogOut (e) {
    e.stopPropagation();
    axios.get('/logout')
    .then(response => {
      this.setState({logoutClick: true});
    });
	}

	handleSubmit (e) {
		e.stopPropagation();

		var obj = {};
		for (var key in this.state) {
			if (this.state[key]){
				obj[key] = this.state[key];
			}
		}

		axios.put('/api/updateuser', obj)
		.then(response => {
			if (response.data.status === 'SUCCESS') {
				this.setState({userUpdated: true});
			}
		});

	}

	usernameChange (e) {
		e.stopPropagation();
		this.setState({login: e.target.value});
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
		this.setState({streetAddress: e.target.value});
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
		this.setState({zipCode: e.target.value});
	}


	render () {

		if (this.state.userUpdated) {
			return (<Redirect to='/admin' />);
		}

		if (this.state.logoutClick) {
			return (<Redirect to='/' />)
		}

		if (this.state.returnHome) {
			return (<Redirect to='/api' />);
		}

		if (this.state.cancelUpdate) {
			return (<Redirect to= '/admin'/>);
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
                    <img alt="Brand" src="../img/updateUser.png" height="30px"/>
                  </a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li><a href="#" onClick={this.homeClick}>Home</a></li>
                    <li><a href="/admin">Applications</a></li>
                    <li className="active"><a href="#">Admin<span className="sr-only">(current)</span></a></li>
                    <li><a href="#" onClick={this.handleLogOut}>Logout</a></li>                 
                  </ul>
                </div>
              </div>
          </nav>

			<h2>Update User</h2>

			<label>Username</label>
			<input type="text" id="login" className="form-control" value={this.state.login} 
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
			<input type="text" id="address" className="form-control" value={this.state.streetAddress} 
							onChange={this.addressChange} required></input>

			<label>City</label>
			<input type="text" id="city" className="form-control" value={this.state.city} 
							onChange={this.cityChange} required></input>

			<label>State</label>
			<input type="text" id="state" className="form-control" value={this.state.state} 
							onChange={this.stateChange} required></input>

			<label>Zip</label>
			<input type="text" id="zip" className="form-control" value={this.state.zipCode} 
							onChange={this.zipChange} required></input>

			<Button bsStyle="primary" onClick={this.handleSubmit}>Update</Button>
			<Button onClick={this.handleCancel}>Cancel</Button>

			</div>);
	}
}

module.exports = UpdateUser;