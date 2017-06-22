//registerPage.jsx

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './registrationPage.css';

class RegistrationPage extends React.Component {

	constructor(props) {
		super (props);
		this.state = { 
			firstName: 	'',
			lastName: 	'',
			email: 			'',
			address: 		'',
			city: 			'',
			state: 			'',
			zip: 				'',
			newUserVaidated: false,
			passwordError: false,
		};

		this.getFirstName 	= this.getFirstName.bind(this);
		this.getLastName 		= this.getLastName.bind(this);
		this.getEmail 			= this.getEmail.bind(this);
		this.getAddress 		= this.getAddress.bind(this);
		this.getCity 				= this.getCity.bind(this);
		this.getState 			= this.getState.bind(this);
		this.getZip 				= this.getZip.bind(this);
		this.register 			=	this.register.bind(this);
	}

	getFirstName 	(e) { e.preventDefault(); this.setState({ firstName: 	e.target.value})}
	getLastName 	(e) { e.preventDefault(); this.setState({ lastName: 	e.target.value})}
	getEmail	 		(e) { e.preventDefault(); this.setState({ email: 			e.target.value})}
	getAddress 		(e) { e.preventDefault(); this.setState({ address: 		e.target.value})}
	getCity 			(e) { e.preventDefault(); this.setState({ city: 			e.target.value})}
	getState 			(e) { e.preventDefault(); this.setState({ state: 			e.target.value})}
	getZip 				(e) { e.preventDefault(); this.setState({ zip: 				e.target.value})}

	register () {

		this.setState({ passwordError: false});

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var isValidEmail = re.test(this.state.email);

		if ( this.state.firstName.length > 0 &&
			this.state.lastName.length > 0 &&
			isValidEmail ) {

			axios.post('/register', {
				firstName: 	this.state.firstName,
				lastName: 	this.state.lastName,
				email: 			this.state.email,
				address: 		this.state.address,
				city: 			this.state.city,
				state: 			this.state.state,
				zip: 				this.state.zip,
				username: 	this.state.email
			})
			.then(response => {
				
				if (response.data.status === 'SUCCESS') {
					this.setState({newUserVaidated: true});

				} else if (response.data.status === 'USER_EXISTS') {
					this.setState({
						passwordError: true,
						errorMessage: 'That email is already registered'
						});
					
				} else if (response.data.error) {
					console.log(response.data.error);
				}
			});

		} else {
			
			this.setState({passwordError: true});
			if ( 	this.state.firstName.length === 0 || 
						this.state.lastName.length	=== 0 ) {
				this.setState({errorMessage: 'First and last name are required'});
			} else if ( ! isValidEmail) {
				this.setState({errorMessage: 'Enter an valid email address'});
			} 
		}
	}

	render () {

		if (this.state.newUserVaidated) {
			return (<Redirect to='/' />);
		}

		return ( 
			<div className="container">
				<nav className="navbar navbar-default">
	    		<div className="navbar-header">
      			<a className="navbar-brand" href="#">
        			<img alt="Brand" src="img/updateUser.png" height="30px"/>
      			</a>
    			</div>
	    	</nav>

				<h2>
					Registration Page
				</h2>
				<p> Welcome to AMCE Group's registration page.  Please supply the information below,  
				and and email will be sent to you to complete the registration process </p>
				<p> Our site uses the Google Authenticator MFA for logiin in. You will be guided through the MFA process when you follow the activation email steps</p>
				{ this.state.passwordError && <div> 
					<h4>{this.state.errorMessage}</h4>
					</div>}

					<div className="register-pane">
						<input 	type="text" className="form-control shareLine" placeholder="First Name"
										value={this.state.firstName} onChange={this.getFirstName}></input>

						<input 	type="text"  className="form-control shareLine" placeholder="Last Name"
										value={this.state.lastName} onChange={this.getLastName}></input>

						<input 	type="text"  className="form-control singleLine" placeholder="Email"
										value={this.state.email} onChange={this.getEmail}></input>
		
						<input 	type="text"  className="form-control singleLine" placeholder="Address"
										value={this.state.address} onChange={this.getAddress}></input>
		
						<input 	type="text"  className="form-control shareLine" placeholder="City"
										value={this.state.city} onChange={this.getCity}></input>

						<input 	type="text"  className="form-control shareLine" placeholder="State"
										value={this.state.state} onChange={this.getState}></input>

						<input 	type="text"  className="form-control singleLine" placeholder="Zip"
										value={this.state.zip} onChange={this.getZip}></input>

						<button className="btn btn-lg btn-primary btn-block btn-signin"
										onClick={this.register}>Sign Up</button>
					
					</div>
			</div>
			);
	}

};

module.exports = RegistrationPage;