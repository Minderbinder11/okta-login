// updateUser.jsx

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class UpdateUser extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			userUpdated: false,
			userId: this.props.match.params.userId,
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

	componentDidMount (){

		console.log('userid params', this.props.match.params.userId);

		axios.get('/api/getUser/' + this.props.match.params.userId)
		.then(response => {
			var user = response.data.user;
			user = JSON.parse(user);
			console.log('response from get one user', user)
			
			this.setState({
				userUpdated: false,
				userId: user.id,
				login: user.profile.login,
				firstName: user.profile.firstName,
				lastName: user.profile.lastName,
				email: user.profile.email,
				streetAddress: user.profile.streetAddress,
				city: user.profile.city,
				state: user.profile.state,
				zipCode: user.profile.zipCode
			});
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
				console.log('response from create: ', response)
				if (response.data.status === 'SUCCESS') {
					this.setState({userUpdated: true});
				}
			});

	}

	usernameChange (e) {
		this.setState({login: e.target.value});
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
		this.setState({streetAddress: e.target.value});
	}

	cityChange (e) {
		this.setState({city: e.target.value});
	}

	stateChange (e) {
		this.setState({state: e.target.value});
	}

	zipChange (e) {
		this.setState({zipCode: e.target.value});
	}


	render () {

		if (this.state.userUpdated) {
			return (<Redirect to='/admin' />);
		}

		return (<div> 
			<h2>Update User</h2>

			<label>Username</label>
			<input type="email" id="login" className="form-control" value={this.state.login} 
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

			<button onClick={this.handleSubmit}>Update</button>

			</div>);
	}
}

module.exports = UpdateUser;