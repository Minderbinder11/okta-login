// adminPage.jsx

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import AdminTableRow from './adminTableRow.jsx';


class AdminPage extends React.Component {

	constructor(props) {
		super(props);

		// eventually move this to MobX
		this.state = {
			createUserLink: false,
			updateUserLink: false,
			returnHome: false,
			everyone: [],
			selected: [],
			selectedUser: ''
		};

		this.displayUsers										= this.displayUsers.bind(this);
		this.homeClick	 										= this.homeClick.bind(this);
		this.createUser 										= this.createUser.bind(this);
		this.updateUser 										= this.updateUser.bind(this);
		this.suspendUser 										= this.suspendUser.bind(this);
		this.unsuspendUser									= this.unsuspendUser.bind(this);
		this.deleteUser											= this.deleteUser.bind(this);
		this.selectUser 										= this.selectUser.bind(this);
		this.initializeState								= this.initializeState.bind(this);

	}

	displayUsers (e) {
		console.log('target', e.target.id)
		
		if (e.target.id === 'EVERYONE') {
			console.log('in everyone')
			this.setState({selected: this.state.everyone});
		} else {

			var filterList = this.state.everyone.filter(user => user.status === e.target.id);
			this.setState({selected: filterList});
		}
	}


	homeClick () {
		this.setState({returnHome: true});
	}

	createUser () {
		this.setState({createUserLink: true});
	}

	updateUser () {
		if (this.state.selectedUser) {
			console.log('in update user',this.state.selectedUser)
			this.setState({updateUserLink: true});
		}
	}

	unsuspendUser () {
		console.log('Im about to UNsuspend this sucker:', this.state.selectedUser);

		if (this.state.selectedUser && this.state.selectedUser.status === 'SUSPENDED' ) {

			axios.post('/api/unsuspendUser', {userId: this.state.selectedUser.id})
			.then(response => {
				console.log('response from suspended user');
				if (response.data.status === 'SUCCESS'){
					this.initializeState();
				}
			})
		} else {
			console.log('no user selected');
		}
	}


	suspendUser () {
		if (this.state.selectedUser && this.state.selectedUser.status === 'ACTIVE') {

			axios.post('/api/suspendUser', {userId: this.state.selectedUser.id})
			.then(response => {
				console.log('response from suspendUser');
				if (response.data.status === 'SUCCESS') {
					this.initializeState();
				}
			});
		} else {
			// send message to user the current user is not active
			console.log('no selected User or users isnot active')
		}
	}

	deleteUser () {

		if (this.state.selectedUser) {
			axios.post('/api/deleteUser', {userId: this.state.selectedUser.id})
			.then(response => {
				console.log('delete callback', response.data)
				if (response.data.status === 'SUCCESS') {
					console.log('intialize state');
					this.initializeState();
				}
			});
		} else {
			console.log('no user selected')
		}
	}

	selectUser(user) {
		this.setState({selectedUser: user});
		console.log('selected user', user);
	}

	componentDidMount () {

		this.initializeState();
	}

	initializeState () {

		console.log('in initialize state');

		var everyone= [], active = [], provisioned = [], staged = [], recovery = [], deprovisionedUsers =[], 
			passwordExpired = [], locked = [], suspended = [];


		axios.get('/api/getUsers')
		.then(response => {
			console.log('users', response.data.users)

			this.setState({
				everyone: response.data.users
				});

			this.setState({
				selected: this.state.everyone
			});

		});
	}



	render() {

		var selected = this.state.selected;

		if (this.state.createUserLink) {
			 return (<Redirect to='/createUser' />);
		}

		if (this.state.updateUserLink) {
			//<Link to={{pathname: '/updateUser/' + this.state.selectedUser.id}}>Update User</Link>
			return (<Redirect to={{pathname: '/updateUser/' + this.state.selectedUser.id}} />);
		}

		if (this.state.returnHome) {
			return (<Redirect to='/api' />)
		}

		return (
			<div>
			<div>
				<h2> 
					Administration Page
				</h2>
				<button onClick={this.homeClick}>Home</button>
			</div>
				

				
				<button onClick={this.createUser}> Create User</button>
				<button onClick={this.updateUser}> Update User</button>
				<button onClick={this.deleteUser}> Delete User</button>
				<button onClick={this.suspendUser}> Suspend User </button>
				<button onClick={this.unsuspendUser}> Unsuspend User </button>

				<div className="user-manager">

					<div className="status-filter">
					Filters
						<ul className="status-list">
							<li id="EVERYONE" className="status-item" onClick={this.displayUsers}>Everyone</li>
							<li id="ACTIVE" className="status-item" onClick={this.displayUsers}>Active</li>
							<li id="PROVISIONED" className="status-item" onClick={this.displayUsers}>Provisioned</li>
							<li id="RECOVERY" className="status-item" onClick={this.displayUsers}>Recovery</li>
							<li id="STAGED" className="status-item" onClick={this.displayUsers}>Staged</li>
							<li id="LOCKED" className="status-item" onClick={this.displayUsers}>Locked</li>
							<li id="SUSPENDED" className="status-item" onClick={this.displayUsers}>Suspended</li>
							<li id="PASSWORD_EXPIRED" className="status-item" onClick={this.displayUsers}>Password Expired</li>
							<li id="DEPROVISIONED" className="status-item" onClick={this.displayUsers}>Deprovisioned</li>	 					
						</ul>
					</div>
					<div className="user-list">
						<table>

							<thead>
								<tr>
	                <th data-field="id" className="columnA">User</th>
	                <th data-field="name" className="columnB">Email</th>
	                <th data-field="price" className="columnC">Status</th>
	               </tr>
							</thead>
							<tbody>
							{
								selected.map(user => {
									return (<AdminTableRow user={user} selected={this.state.selectedUser} 
														key={user.id} selectUser={this.selectUser.bind(this, user)}/>)
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			);
	}
};

module.exports = AdminPage;