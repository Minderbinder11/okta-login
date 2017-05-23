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
			mfaActivate: false
		};
		this.handleUsernameChange 	= this.handleUsernameChange.bind(this);
		this.handlePasswordChange		= this.handlePasswordChange.bind(this);
		this.handleSubmit 					= this.handleSubmit.bind(this);
		this.handleMFASubmit 				= this.handleMFASubmit.bind(this);
		this.handleMFAChange 				= this.handleMFAChange.bind(this);
		this.hanldeActivateMFA			= this.hanldeActivateMFA.bind(this);
		this.handleMFAActivateCode	= this.handleMFAActivateCode.bind(this);
		this.resetPassword 					= this.resetPassword.bind(this);
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
			console.log('response', response);
			if (response.data.error) {
				console.log('login error');
				this.setState({
					showLoginError: true,
					username: '',
					password: ''
				});
			} else if (response.data.status === 'AUTHENTICATED') {
					console.log('Authenticated');
				 this.setState({isAuth: true})

			} else if (response.data.status === 'ENROLL'){
				// here I need to show link to MFA Enrollment
				console.log('enroll');
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
		console.log('Ive been clicked');

		axios.get('/passwordreset')
		.then(response => {
			console.log(response);
			if (response.data.status === 'SUCCESS') {
				// redirect to new page like the qr code

			} else if (response.data.status === 'NO_USERID') {
				// set state to prompt for user is

			} else if (response.data.error) {
				// set state to show error message
			}

		})
		.catch(error => {
			console.log(error)
		});
	}

	render(){

		if(this.state.isAuth){
			return (
				<Redirect to='/api' />
				);
		}


		return (
			<div>

				{this.state.mfaError && <div className="alert alert-danger login-message" role="alert"> 
					Incorrect Google Authenticator Code
				</div>}

    <div className="container">
        <div className="card card-container">
            <img id="profile-img" className="profile-img-card" src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" />
            <p id="profile-name" className="profile-name-card"></p>
            <div className="form-signin">
                <span id="reauth-email" className="reauth-email"></span>
                <input 	type="email" 
                				id="inputEmail" 
                				className="form-control" 
                				placeholder="Email address" 
                				value={this.state.username} 
                				onChange={this.handleUsernameChange} 
                				required 
                				autoFocus></input>

                <input 	type="password" 
                				id="inputPassword" 
                				className="form-control" 
                				placeholder="Password" 
                				value={this.state.password} 
                				onChange={this.handlePasswordChange} 
                				required></input>
                <div id="remember" className="checkbox">
                    <label>
                        <input type="checkbox" value="remember-me"></input>
                    </label>
                </div>
                <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit" onClick={this.handleSubmit}>Sign in</button>
            </div>
            <a href="#" className="forgot-password" onClick={this.resetPassword}>
                Forgot the password?
            </a>


          {this.state.mfaEnroll && <div>
					Follow link to Active Google Authenticate MFA
					<a href={this.state.mfaEnrollLink} target="blank" onClick={this.hanldeActivateMFA}>Activate</a>
					</div>}

				{this.state.mfaActivate && <div className="alert alert-info login-message">
						<input 	type="text" 
										className="form-control"
										placeholder="Google Authenticator Code"
										value={this.state.mfacode} 
										onChange={this.handleMFAChange}
										required></input>
										<div className="spacer"></div>
						<button 
										className="btn btn-lg btn-primary btn-block btn-signin"
										onClick={this.handleMFAActivateCode}>Send MFA</button>
				</div>}

				{this.state.showMFA && <div>
						<input 	type="text" 
										className="form-control"
										placeholder="Google Authenticator Code"
										value={this.state.mfacode} 
										onChange={this.handleMFAChange}
										required></input>
						<div className="spacer"></div>
						<button 
										className="btn btn-lg btn-primary btn-block btn-signin"
										onClick={this.handleMFASubmit}>Send MFA</button>
				</div>}

        </div>
    </div>

				
			</div>
			);
	}
}

module.exports = LoginPage;