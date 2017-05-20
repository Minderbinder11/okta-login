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
			isAuth: false,
			mfaEnroll: false,
			mfaEnrollLink: '',
			mfaActivate: false
		};
		this.handleUsernameChange 	= this.handleUsernameChange.bind(this);
		this.handlePasswordChange		= this.handlePasswordChange.bind(this);
		this.handleSubmit 					= this.handleSubmit.bind(this);
		this.handleMFASubmit 				= this.handleMFASubmit.bind(this);
		this.handleMFAChange 				= this.handleMFAChange.bind(this);
		this.hanldeActivateMFA			= this.hanldeActivateMFA.bind(this);
		this.handleMFAActivateCode	= this.handleMFAActivateCode.bind(this);
	}

	componentDidMount() {
		axios.get('/isAuth')
		.then(response => {
			if(	response.data.status === 'ACTIVE') {
				this.setState({isAuth: true});
			}
		});
	}

	 handleMFAActivateCode () {
	
	 	var code = this.state.mfacode;
	 	this.setState({
	 		mfacode: '',
	 		mfaActivate: false
	 		});

	 	axios.post('/mfaactivate', {mfacode: code})
	 	.then(response => {
	 		console.log('mfa activate response')
	 		if(response.data.status === 'SUCCESS') {
	 			this.setState({
	 				showMFA: true,
	 				mfaActivate: false,
	 				mfacode: ''
	 			});
	 		} else {
	 			this.setState({
	 				mfaactivate: false,
	 				showLoginError: true
	 			});
	 		}
	 	});

	 }

	hanldeActivateMFA () {
		this.setState({
			mfaEnroll: false,
			mfaEnrollLink: '',
			mfaActivate: true
		});
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
			} else if (response.data.status === 'AUTHENTICATED') {

				 this.setState({isAuth: true})

			} else if (response.data.status === 'ENROLL'){
				// here I need to show link to MFA Enrollment
				this.setState({
					mfaEnroll: true,
					mfaEnrollLink: response.data.href
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

				{this.state.mfaEnroll && <div>
					Follow link to Active Google Authenticate MFA
					<a href={this.state.mfaEnrollLink} target="blank" onClick={this.hanldeActivateMFA}>Activate</a>
					</div>}

				{this.state.mfaActivate && <div>
						<h2>Enter MFA Activation Code here</h2>
						<input type="text" value={this.state.mfacode} onChange={this.handleMFAChange}></input>
						<button onClick={this.handleMFAActivateCode}>Send MFA</button>
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