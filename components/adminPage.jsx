// adminPage.jsx

import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminTableRow from './adminTableRow.jsx';


class AdminPage extends React.Component {

	constructor(props) {
		super(props);

		// eventually move this to MobX
		this.state = {
			everyone: [],
			activeUsers: [],
			provisionedUsers: [],
			stagedUsers: [],
			recoveryUsers: [],
			deprovisionedUsers:[],
			passwordExpiredUsers: [],
			lockedUsers:[],
			suspendedUsers: [],
			selected: [],
			selectedUser: ''
		};

		this.suspendUser 										= this.suspendUser.bind(this);
		this.unsuspendUser									= this.unsuspendUser.bind(this);
		this.selectUser 										= this.selectUser.bind(this);
		this.selectActiveUsers							= this.selectActiveUsers.bind(this);
		this.selectEveryone		 							= this.selectEveryone.bind(this);
		this.selectProvisionedUsers		 			= this.selectProvisionedUsers.bind(this);
		this.selectStagedUsers		 					= this.selectStagedUsers.bind(this);
		this.selectRecoveryUsers		 				= this.selectRecoveryUsers.bind(this);
		this.selectDeprovisionedUsers		 		= this.selectDeprovisionedUsers.bind(this);
		this.selectPasswordExpiredUsers		 	= this.selectPasswordExpiredUsers.bind(this);
		this.selectLockedUsers		 					= this.selectLockedUsers.bind(this);
		this.selectSuspendedUsers						= this.selectSuspendedUsers.bind(this);
		this.initializeState								= this.initializeState.bind(this);

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
			console.log('no selected User or users isnot active')
		}

	}

	selectUser(user) {
		this.setState({selectedUser: user});
		console.log('selected user', user);
	}

	selectEveryone () {
		this.setState({selected: this.state.everyone});
	}

	selectActiveUsers () {
		this.setState({selected: this.state.activeUsers});
	}

	selectProvisionedUsers () {
		this.setState({selected: this.state.provisionedUsers});
	}

	selectStagedUsers () {
		this.setState({selected: this.state.stagedUsers});
	}

	selectRecoveryUsers () {
		this.setState({selected: this.state.recoveryUsers});
	}

	selectDeprovisionedUsers () {
		this.setState({selected: this.state.deprovisionedUsers});
	}

	selectPasswordExpiredUsers () {
		this.setState({selected: this.state.passwordExpiredUsers});
	}

	selectLockedUsers () {
		this.setState({selected: this.state.lockedUsers});
	}

	selectSuspendedUsers () {
		this.setState({selected: this.state.suspendedUsers});
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
			console.log('users', response)

			response.data.users.map(user => {
				switch (user.status) {
					case 'ACTIVE':
						everyone.push(user);
						active.push(user);
						break;
					case 'STAGED':
						everyone.push(user);
						staged.push(user);
						break;
					case 'PROVISIONED':
						everyone.push(user);
						provisioned.push(user);
						break;
					case 'PASSWORD_EXPIRED':
						everyone.push(user);
						passwordExpired.push(user);
						break;
					case 'LOCKED_OUT':
						everyone.push(user);
						locked.push(user);
					case 'RECOVERY':
						everyone.push(user);
						recovery.push(user);
						break;
					case 'DEPROVISIONED':
						everyone.push(user);
						deprovisionedUsers.push(user);
						break;
					case 'SUSPENDED':
						everyone.push(user);
						suspended.push(user);
						break;
					default:
						everyone.push(user);
						break;
				}

			});

			this.setState({
				everyone: everyone,
				activeUsers: active,
				provisionedUsers: provisioned,
				stagedUsers: staged,
				recoveryUsers: recovery,
				deprovisionedUsers:deprovisionedUsers,
				passwordExpiredUses: passwordExpired,
				lockedUsers:locked,
				suspendedUsers: suspended
			});

			this.setState({
				selected: this.state.everyone
			});
		});
	}



	render() {

		var selected = this.state.selected;


		return (
			<div>
			<div>
				<h2> 
					Administration Page
				</h2>

			</div>
				
				<Link to='/createUser'>Create User</Link>
				<Link to={{pathname: '/updateUser/' + this.state.selectedUser.id}}>Update User</Link>
				<button onClick={this.deleteUSer}> Delete User</button>
				<button onClick={this.suspendUser}> Suspend User </button>
				<button onClick={this.unsuspendUser}> Unsuspend User </button>

				<div className="user-manager">

				<div className="status-filter">
				Filters
					<ul className="status-list">
						<li className="status-item" onClick={this.selectEveryone}>Everyone</li>
						<li className="status-item" onClick={this.selectActiveUsers}>Active</li>
						<li className="status-item" onClick={this.selectProvisionedUsers}>Provisioned</li>
						<li className="status-item" onClick={this.selectRecoveryUsers}>Recovery</li>
						<li className="status-item" onClick={this.selectStagedUsers }>Staged</li>
						<li className="status-item" onClick={this.selectLockedUsers}>Locked</li>
						<li className="status-item" onClick={this.selectSuspendedUsers}>Suspended</li>
						<li className="status-item" onClick={this.selectPasswordExpiredUsers}>Password Expired</li>
						<li className="status-item" onClick={this.selectDeprovisionedUsers}>Deprovisioned</li>	 					
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