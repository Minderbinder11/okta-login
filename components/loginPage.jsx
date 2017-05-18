// loginPage.js

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import HomePage from './homePage.jsx';


class LoginPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			showMFA: false,
			showLoginError: false,
			mfacode: '',
			mfaError: false,
			isAuth: false
		};
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handlePasswordChange	= this.handlePasswordChange.bind(this);
		this.handleSubmit 				= this.handleSubmit.bind(this);
		this.handleMFASubmit 			= this.handleMFASubmit.bind(this);
		this.handleMFAChange 			= this.handleMFAChange.bind(this);
	}

	handleUsernameChange (e) {
		this.setState({ username: e.target.value });
	}

	handlePasswordChange (e) {
		this.setState({ password: e.target.value });
	}

	handleSubmit () {
		axios.post('/login', {
				username: this.state.username,
				password: this.state.password })
		.then(response => {
			console.log('response', response)
			if (response.data.error) {
				this.setState({
					showLoginError: true,
					username: '',
					password: ''
				});
			} else {
				this.setState({showMFA: true});		
			}
		})
		.catch(err => {
			console.log('error')
		})
	}

	handleMFAChange (e) {
		this.setState({mfacode: e.target.value});
	}

	handleMFASubmit () {

		this.setState({mfaError: false});
		axios.post('/mfa', {
			mfacode: this.state.mfacode })
		.then( response => {

			console.log('response.data: ', response.data);

			if (response.data.factorResult === 'SUCCESS') {
				this.setState({showMFA: false});
				this.setState({isAuth: true});
				// now need to redirect them to a landing page

			} else {
				// show an error message
				this.setState({mfaError: true});
			}
		
		})
		.catch( err => {
			console.log(err);
		})
	}

	render(){

		if(this.state.isAuth){
			return (
				<Redirect to='/api' />
				);
		}


		return (<div>
				<div className="bannerBox"></div>
				<label>Username</label><input type="text" value={this.state.username} onChange={this.handleUsernameChange}></input>
				<label>Password</label><input type="text" value={this.state.password} onChange={this.handlePasswordChange}></input>
				<button onClick={this.handleSubmit}>Submit</button>

				{this.state.mfaError && <div> 
						<h2>Incorrect MFA Code</h2>
					</div>}

				{this.state.showMFA && <div> 
						<h2>GET MFA CODE HERE</h2>
						<input type="text" value={this.state.mfacode} onChange={this.handleMFAChange}></input>
						<button onClick={this.handleMFASubmit}>Send MFA</button>
					</div>}
			</div>
			);
	}
}

module.exports = LoginPage;