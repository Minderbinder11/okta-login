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
			selectedUser: '',
			currentlySelectedStage: 'EVERYONE'
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

		if (e.target.id === 'EVERYONE') {
			this.setState({
				selected: this.state.everyone,
				currentlySelectedStage: e.target.id
			});
		} else {
			var filterList = this.state.everyone.filter(user => user.status === e.target.id);
			this.setState({
				selected: filterList,
				currentlySelectedStage: e.target.id
			});
			
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
			console.log('no selected User or users is not active')
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

	componentWillMount () {
		var lifecycleStages = [
			{ 
				name: "ACTIVE", 
				count: 0 
			},{ 
				name: "PROVISIONED", 
				count: 0 
			},{ 
				name: "RECOVERY", 
				count: 0 
			},{ 
				name: "STAGED", 
				count: 0 
			},{ 
				name: "LOCKED", 
				count: 0 
			},{ 
				name: "SUSPENDED",
				count: 0  
			},{ 
				name: "PASSWORD_EXPIRED", 
				count: 0 
			},{ 
				name: "DEPROVISIONED",
				count: 0 
			}
		];
		this.setState({lifecycleStages: lifecycleStages});
	}

	componentDidMount () {
		this.initializeState();
	}

	initializeState () {

		axios.get('/api/getUsers')
		.then(response => {
			this.setState({
				everyone: response.data.users,
				selected: this.state.everyone
			});
	
			var lifecycleStages = this.state.lifecycleStages;
			var obj = {}, results = [];
			
			lifecycleStages.map(stage => {
				var users = this.state.everyone.filter(user =>
					user.status === stage.name);
				obj = {
					name: stage.name,
					count: users.length
				};
				results.push(obj);
			});

			obj = {
				name: 'EVERYONE',
				count: this.state.everyone.length
			};
			results.unshift(obj);
			this.setState({ lifecycleStages: results });
		});
	}

	render() {

		var selected = this.state.selected;
		
		if (this.state.createUserLink) {
			 return (<Redirect to='/createUser' />);
		}

		if (this.state.updateUserLink) {
			return (<Redirect to={{pathname: '/updateUser/' + this.state.selectedUser.id}} />);
		}

		if (this.state.returnHome) {
			return (<Redirect to='/api' />)
		}

	var lifecycleStages = this.state.lifecycleStages;
	var classes = "list-group-item status-item";
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
							{lifecycleStages.map(stage => {
								console.log(this.state.currentlySelectedStage);
								if (this.state.currentlySelectedStage === stage.name) {
									classes += " active"
								} else {
									classes = "list-group-item status-item";
								}
							return 	(<li id={stage.name} className={classes} 
									onClick={this.displayUsers} key={stage.name}>
									<span className="badge">{stage.count}</span>
									{stage.name}
							</li>)
						})}
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