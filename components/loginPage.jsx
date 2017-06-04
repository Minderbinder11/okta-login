// loginPage.js

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import HomePage from './homePage.jsx';

// PROBLEM OF SIGNING IN AND THE HITTING REFRESH AND HAVING IT GO TO THE LOGIN PAGE


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
			mfaActivate: false,
			resetPassordError: false,
			passwordResetSuccess: true,
			register: false
		};
		this.handleUsernameChange 	= this.handleUsernameChange.bind(this);
		this.handlePasswordChange		= this.handlePasswordChange.bind(this);
		this.handleSubmit 					= this.handleSubmit.bind(this);
		this.handleMFASubmit 				= this.handleMFASubmit.bind(this);
		this.handleMFAChange 				= this.handleMFAChange.bind(this);
		this.hanldeActivateMFA			= this.hanldeActivateMFA.bind(this);
		this.handleMFAActivateCode	= this.handleMFAActivateCode.bind(this);
		this.resetPassword 					= this.resetPassword.bind(this);
		this.register								= this.register.bind(this);
	}

	componentDidMount() {
		axios.get('/isAuth')
		.then(response => {
			if(	response.data.status === 'ACTIVE') {
				this.setState({isAuth: true});
			}
		});
	}

	register (e) 							{ this.setState({register: true}); }
	handleUsernameChange (e) 	{ this.setState({ username: e.target.value }); }
	handlePasswordChange (e) 	{ this.setState({ password: e.target.value }); }
	handleMFAChange (e) 			{ this.setState({ mfacode: 	e.target.value}); }

	
	handleMFAActivateCode () {

	 	this.setState({
	 		mfacode: '',
	 		mfaActivate: false
	 		});

	 	axios.post('/mfaactivate', {mfacode: this.state.mfacode})
	 	.then(response => {

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

	handleSubmit () {

		axios.post('/login', {
				username: this.state.username,
				password: this.state.password })
		.then(response => {

			if (response.data.error) {
				this.setState({
					showLoginError: true,
					username: '',
					password: ''
				});
			} else if (response.data.status === 'AUTHENTICATED') {
				 this.setState({isAuth: true})

			} else if (response.data.status === 'ENROLL'){

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

	handleMFASubmit () {

		this.setState({mfaError: false});
		axios.post('/mfa', {mfacode: this.state.mfacode })
		.then( response => {

			if (response.data.factorResult === 'SUCCESS') {
				this.setState({showMFA: false});
				this.setState({isAuth: true});

			} else {
				// show an error message
				this.setState({
					mfaError: true,
					mfacode: ''
					});
			}
		
		})
		.catch( err => {
			console.log(err);
		})
	}

	resetPassword () {

		axios.get('/passwordreset', {params: {email: this.state.username}})
		.then(response => {

			if (response.data.status === 'SUCCESS') {
				this.setState({passwordResetSuccess: true});
			} else if (response.data.status === 'NO_USERID') {
				this.setState({resetPassordError: true });
			} else if (response.data.status === 'ERROR') {
				console.log('error in password reset');
			}

		})
		.catch(error => {
			console.log(error)
		});
	}

	render(){

		if(this.state.isAuth){
			return ( <Redirect to='/api' />);
		}

		if (this.state.register) {
			return ( <Redirect to='/signup' />);
		}

		return (
			<div>
				{this.state.mfaError && <div className="alert alert-danger login-message" role="alert"> 
					Incorrect Google Authenticator Code
				</div>}

				{this.state.resetPassordError && <div className="alert alert-danger login-message successfully-saved" role="alert"> 
					Incorrect Username
				</div>}

				{this.state.passwordResetSuccess && <div className="alert alert-danger login-message successfully-saved" role="alert"> 
					A Password Reset Email Has Been Sent
				</div>}

	    <div className="container">
	    	<nav className="navbar navbar-default">
	    		<div className="navbar-header">
      			<a className="navbar-brand" href="#">
        			<img alt="Brand" src="img/updateUser.png" height="30px"/>
      			</a>
    			</div>
	    	</nav>
	    	<div className="login-pane">
	      <div className="card card-container">
	        <img id="profile-img" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
	        <p id="profile-name" className="profile-name-card"></p>
	        <div className="form-signin">
            <span id="reauth-email" className="reauth-email"></span>
            <input 	type="email" className="form-control input-margin" placeholder="Email address" 
            				value={this.state.username} onChange={this.handleUsernameChange}></input>

            <input 	type="password" className="form-control input-margin" placeholder="Password" 
            				value={this.state.password} onChange={this.handlePasswordChange}></input>
            
            <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit" 
            				onClick={this.handleSubmit}>Sign in</button>
        	</div>
            <a href="#" className="forgot-password" onClick={this.resetPassword}>
                Forgot the password?
            </a>

            <a href="#" className="forgot-password" onClick={this.register} >
                Sign Up
            </a>

	          {this.state.mfaEnroll && <div>
						Follow link to Active Google Authenticate MFA
						<a href={this.state.mfaEnrollLink} target="blank" onClick={this.hanldeActivateMFA}>Activate</a>
						</div>}

					{this.state.mfaActivate && <div className="alert alert-info login-message">
							<input 	type="text" className="form-control input-margin" placeholder="Google Authenticator Code"
											value={this.state.mfacode} onChange={this.handleMFAChange}></input>
											<div className="spacer"></div>
							<button 
											className="btn btn-lg btn-primary btn-block btn-signin"
											onClick={this.handleMFAActivateCode}>Send MFA</button>
					</div>}

					{this.state.showMFA && <div>
							<input 	type="text" className="form-control input-margin" placeholder="Google Authenticator Code"
											value={this.state.mfacode} onChange={this.handleMFAChange}></input>
		
							<button className="btn btn-lg btn-primary btn-block btn-signin"
											onClick={this.handleMFASubmit}>Send MFA</button>
					</div>}

	        </div>
	    	</div>					
	    	</div>
			</div>
			);
	}
}

module.exports = LoginPage;