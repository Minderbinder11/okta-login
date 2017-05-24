// createUser.jsx

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class CreateUser extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userCreated: false,
		};

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

	handleSubmit (e) {
			e.stopPropagation();

			axios.post('/api/newuser', {
				username: 	this.state.username,
				password: 	this.state.password,
				firstName: 	this.state.firstName,
				lastName: 	this.state.lastName,
				email: 			this.state.email,
				address: 		this.state.adddress,
				city: 			this.state.city,
				state: 			this.state.state,
				zip: 				this.state.zip
			})
			.then(response => {
				console.log('response from create: ', response)
				if (response.data.status === 'SUCCESS') {
					this.setState({userCreated: true});
				}
			});

	}

	usernameChange (e) {
		this.setState({username: e.target.value});
	}

	firstNameChange (e) {
		this.setState({firstName: e.target.value});
	}

	lastNameChange (e) {
		this.setState({lastName: e.target.value});
	}

	emailChange (e) {
		this.setState({email: e.target.value});
	}

	addressChange (e) {
		this.setState({address: e.target.value});
	}

	cityChange (e) {
		this.setState({city: e.target.value});
	}

	stateChange (e) {
		this.setState({state: e.target.value});
	}

	zipChange (e) {
		this.setState({zip: e.target.value});
	}


	render () {

		if (this.state.userCreated) {
			return (<Redirect to='/admin' />);
		}

		return (<div> 
			<h2>Create User</h2>

			<label>Username</label>
			<input type="email" id="username" className="form-control" value={this.state.username} 
							onChange={this.usernameChange} required autoFocus></input>

			<label>First Name</label>
			<input type="text" id="firstname" className="form-control" value={this.state.firstName} 
							onChange={this.firstNameChange} required></input>

			<label>Last Name</label>
			<input type="text" id="lastname" className="form-control" value={this.state.lastName} 
							onChange={this.lastNameChange} required></input>

			<label>Email</label>
			<input type="email" id="email" className="form-control" value={this.state.email} 
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

			<button onClick={this.handleSubmit}>Submit</button>

			</div>);
	}
}

module.exports = CreateUser;