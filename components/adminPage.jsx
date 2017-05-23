// adminPage.jsx

import React from 'react';
import axios from 'axios';

class AdminPage extends React.Component {

	constructor(props) {
		super(props);
		this.createUser = this.createUser.bind(this);
		// eventually move this to MobX
		this.state = {
			activeUsers: [],
			provisionedUsers: [],
			stagedUsers: [],
			recoveryUsers: [],
			deprovisionedUsers:[],
			passwordExpiredUses: [],
			lockedUsers:[]
		};
	}

	componentDidMount () {
		// get a list of all users
		var active = [], provisioned = [], staged = [], recovery = [], deprovisionedUsers =[], 
			passwordExpired = [], locked = [];


		axios.get('/api/getUsers')
		.then(response => {
			console.log('users', response)

			response.data.users.map(user => {
				switch (user.status) {
					case 'ACTIVE':

						active.push(user);
						break;
					case 'STAGED':
						staged.push(user);
						break;
					default:
						break;
				}

			});

			this.setState({
				activeUsers: active,
				provisionedUsers: provisioned,
				stagedUsers: staged,
				recoveryUsers: recovery,
				deprovisionedUsers:deprovisionedUsers,
				passwordExpiredUses: passwordExpired,
				lockedUsers:locked
			});

		});

	}

	createUser () {
		// get necessary user info to create a new user
	}

	render() {

		var active = this.state.activeUsers;

		return (
			<div>
			<div>
				active users
				<ul>
					{active.map(user =>{
						return <li key={user.id}>{user.profile.firstName} {user.profile.lastName}</li>
					})}
				</ul>
			</div>
				Admin Page
				<button onClick={this.createUser}> Create User</button>
				<button onClick={this.deleteUSer}> Delete User</button>

			</div>
			);
	}
};

module.exports = AdminPage;