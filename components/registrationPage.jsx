//registerPage.jsx

import React from 'react';
import axios from 'axios';
import ValidatePassword from 'validate-password';

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
			password1: 	'',
			password2:  '', 
		};

		this.getFirstName 	= this.getFirstName.bind(this);
		this.getLastName 		= this.getLastName.bind(this);
		this.getEmail 			= this.getEmail.bind(this);
		this.getAddress 		= this.getAddress.bind(this);
		this.getCity 				= this.getCity.bind(this);
		this.getState 			= this.getState.bind(this);
		this.getZip 				= this.getZip.bind(this);
		this.register 			=	this.register.bind(this);
		this.getPassword1		= this.getPassword1.bind(this);
		this.getPasword2		= this.getPassword2.bind(this);
	}

	getFirstName 	(e) { e.preventDefault(); this.setState({firstName: e.target.value})}
	getLastName 	(e) { e.preventDefault(); this.setState({lastName: e.target.value})}
	getEmail	 		(e) { e.preventDefault(); this.setState({email: e.target.value})}
	getAddress 		(e) { e.preventDefault(); this.setState({address: e.target.value})}
	getCity 			(e) { e.preventDefault(); this.setState({city: e.target.value})}
	getState 			(e) { e.preventDefault(); this.setState({state: e.target.value})}
	getZip 				(e) { e.preventDefault(); this.setState({zip: e.target.value})}
	getPassword1 	(e) { e.preventDefault(); this.setState({password1: e.target.value})}
	getPassword2	(e) { e.preventDefault(); this.setState({password2: e.target.value})}

	register () {
		// error check for necessary items

		var options = {
       enforce: {
        lowercase: true,
        uppercase: true,
        specialCharacters: false,
        numbers: true
      }
    };
 
		var validator = new ValidatePassword(options);
		var passwordData = validator.checkPassword(this.state.password1, ['password', 'password1', '12345678', 'qwerty']);



		if (passwordData.isValid && 
			this.state.password1 === this.state.password2 && 
			this.state.password1.length > 7 ) {

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
					// redirect to the login page
				} else {
					// dsplay an error message
				}
			});

		} else {

			console.log(passwordData.validationMessage)
		}
	}

	render () {

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

						<input 	type="password"  className="form-control singleLine" placeholder="Password"
										value={this.state.password1} onChange={this.getPassword1}></input>

						<input 	type="password"  className="form-control singleLine" placeholder="Reenter Password"
										value={this.state.password2} onChange={this.getPasword2}></input>

						<button className="btn btn-lg btn-primary btn-block btn-signin"
										onClick={this.register}>Sign Up</button>
					
					</div>
			</div>
			);
	}

};

module.exports = RegistrationPage;