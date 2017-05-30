// adminPage.jsx

import React from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import AdminTableRow from './adminTableRow.jsx';
import { DropdownButton, MenuItem } from 'react-bootstrap';


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
			currentlySelectedStage: 'EVERYONE',
			logoutClick: false
		};

		this.initializeState		= this.initializeState.bind(this);
		this.handleLogOut 			= this.handleLogOut.bind(this);
		this.displayUsers				= this.displayUsers.bind(this);
		this.homeClick	 				= this.homeClick.bind(this);
		this.selectUser 				= this.selectUser.bind(this);

		// lifecycle actions
		this.suspendUser 				= this.suspendUser.bind(this);
		this.unsuspendUser			= this.unsuspendUser.bind(this);
		this.activateUser				= this.activateUser.bind(this);
		this.deactivateUser			= this.deactivateUser.bind(this);
		this.reactivateUser			= this.reactivateUser.bind(this);
		this.unlockUser					= this.unlockUser.bind(this);
		this.passwordExpire  		= this.passwordExpire.bind(this);

		// user actions
		this.createUser 				= this.createUser.bind(this);
		this.deleteUser					= this.deleteUser.bind(this);
		this.updateUser 				= this.updateUser.bind(this);

	}

	unlockUser (e) {
		e.stopPropagation();		
		axios.post('/api/unlockUser', {userId: this.state.selectedUser.id})
		.then(response=> {
			if (response.data.status === 'SUCCESS'){
					this.initializeState();
			}
		});
	}

	reactivateUser (e) {
		e.stopPropagation();		
		axios.post('/api/reactivateUser', {userId: this.state.selectedUser.id})
		.then(response=> {
			if (response.data.status === 'SUCCESS'){
					this.initializeState();
			}
		});
	}


	deactivateUser (e) {
		e.stopPropagation();		
		axios.post('/api/deactivateUser', {userId: this.state.selectedUser.id})
		.then(response=> {
			if (response.data.status === 'SUCCESS'){
					this.initializeState();
			}
		});
	}

	activateUser (e) {
		e.stopPropagation();
		axios.post('/api/activateUser', {userId: this.state.selectedUser.id})
		.then(response=> {
			if (response.data.status === 'SUCCESS'){
					this.initializeState();
			}
		});

	}

	passwordExpire (e) {
		e.stopPropagation();
				axios.post('/api/passwordExpire', {userId: this.state.selectedUser.id})
		.then(response=>{
			if (response.data.status === 'SUCCESS'){
					this.initializeState();
			}
		});
	}

	displayUsers (e) {

		if (e.target.id === 'EVERYONE') {
			this.setState({
				selected: this.state.everyone,
				currentlySelectedStage: e.target.id
			});
		} else {
			var filterList = this.state.everyone.filter(user => user.status === e.target.id);
			console.log('filetred List', filterList)
			this.setState({
				selected: filterList,
				currentlySelectedStage: e.target.id
			});
		}
	}

  handleLogOut (e) {
    e.stopPropagation();
    axios.get('/logout')
    .then(response => {
      this.setState({logoutClick: true});
    });
  }

	homeClick (e) {
		e.stopPropagation();		
		this.setState({returnHome: true});
	}

	createUser (e) {
		e.stopPropagation();		
		this.setState({createUserLink: true});
	}

	updateUser (e) {
		e.stopPropagation();
		if (this.state.selectedUser) {
			this.setState({updateUserLink: true});
		}
	}

	unsuspendUser (e) {
		e.stopPropagation();

		if (this.state.selectedUser && this.state.selectedUser.status === 'SUSPENDED' ) {
			axios.post('/api/unsuspendUser', {userId: this.state.selectedUser.id})
			.then(response => {
				if (response.data.status === 'SUCCESS'){
					this.initializeState();
				}
			})
		} else {
			console.log('no user selected');
		}
	}


	suspendUser (e) {
		e.stopPropagation();		
		if (this.state.selectedUser && this.state.selectedUser.status === 'ACTIVE') {

			axios.post('/api/suspendUser', {userId: this.state.selectedUser.id})
			.then(response => {
				if (response.data.status === 'SUCCESS') {
					this.initializeState();
				}
			});
		} else {
			// send message to user the current user is not active
			console.log('no selected User or users is not active')
		}
	}

	deleteUser (e) {
		e.stopPropagation();
		if (this.state.selectedUser) {
			axios.post('/api/deleteUser', {userId: this.state.selectedUser.id})
			.then(response => {
				if (response.data.status === 'SUCCESS') {
					this.initializeState();
				}
			});
		} else {
			console.log('no user selected')
		}
	}

	selectUser(user) {
		if(this.state.selectedUser === user){
			this.setState({selectedUser: ''})
		} else {
		this.setState({selectedUser: user});
		}
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
				name: "LOCKED_OUT", 
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
			this.setState({selected: this.state.everyone});
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

		if (this.state.logoutClick) {
			return (<Redirect to='/' />)
		}

		var lifecycleStages = this.state.lifecycleStages;
		var classes = "list-group-item status-item";
		return (
			<div className="container-fluid">
			    <nav className="navbar navbar-default">
             <div className="container-fluid">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="">
                    <img alt="Brand" src="img/updateUser.png" height="30px"/>
                  </a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li><a href="#" onClick={this.homeClick}>Home</a></li>
                    <li><a href="/admin">Applications</a></li>
                    <li className="active"><a href="#">Admin<span className="sr-only">(current)</span></a></li>
                    <li><a href="#" onClick={this.handleLogOut}>Logout</a></li>                 
                  </ul>
                </div>
              </div>
          </nav>

    <DropdownButton bsStyle={"primary"} title={"User Actions"} id={"1"}>
      <MenuItem onClick={this.createUser}>Create User</MenuItem>
      { this.state.selectedUser !== '' &&
      <MenuItem onClick={this.updateUser}>Update User</MenuItem>}
      { this.state.selectedUser !== '' &&
      <MenuItem onClick={this.deleteUser}>Delete User</MenuItem>}
    </DropdownButton>
		
		{ this.state.selectedUser &&			
    <DropdownButton bsStyle={"primary"} title={"Lifecycle Actions"} id={"2"}>
    
    	{ this.state.selectedUser.status ==='PROVISIONED' && 
    		<MenuItem onClick={this.reactivateUser}>Rectivate User</MenuItem> }

	    { this.state.selectedUser.status ==='STAGED' &&
	      <MenuItem onClick={this.activateUser}>Activate User</MenuItem> }

	    {  this.state.selectedUser.status !== 'DEPROVISIONED' &&
	      <MenuItem onClick={this.deactivateUser}>Deactivate User</MenuItem> }

	    { this.state.selectedUser.status === 'LOCKED_OUT' &&
	      <MenuItem onClick={this.unlockUser}>Unlock User</MenuItem>} 
	  
	    {  this.state.selectedUser.status !== 'PASSWORD_EXPIRED' &&
	      <MenuItem onClick={this.passwordExpire}>Expire Password</MenuItem>}
	  
	    {  this.state.selectedUser.status === 'RECOVERY' &&
	      <MenuItem onClick={this.resetUser}>Reset User</MenuItem>}
	    
	    { this.state.selectedUser.status ==='ACTIVE' &&
	      <MenuItem onClick={this.suspendUser}>Suspend User</MenuItem>}

	    { this.state.selectedUser.status ==='SUSPENDED' &&
	      	<MenuItem onClick={this.unsuspendUser}>Unsuspend User</MenuItem>}

	    {  this.state.selectedUser.status ==='SUSPENDED' &&	
	     		<MenuItem onClick={this.deactivateUser}>Deactivate User</MenuItem>}
    

    </DropdownButton> }

    {!this.state.selectedUser && 
 			<DropdownButton bsStyle={"primary"} title={"Lifecycle Actions"} id={"2"}>
 			<MenuItem>No User Selected</MenuItem>
 			</DropdownButton>
    }

				<div className="user-manager">
					<div className="status-filter">
					<div className="filterLabel"> Filters</div>
						<ul className="status-list col-md-3">
							{lifecycleStages.map(stage => {
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
					<div className="user-list col-md-9">
      				<div className="panel panel-default">
        				<div className="panel-heading">
          				<h4>Selected Users</h4>
        				</div>
						<table className="table table-striped ">

							<thead>
								<tr>
	                <th className="col-md-6">User</th>
	                <th className="col-md-4">Email</th>
	                <th className="col-md-2">Status</th>
	               </tr>
							</thead>

							<tbody>
							{
								selected.map(user => {
									var selected = false;
									if (user.id === this.state.selectedUser.id) {
										selected = true
									}
									return (<AdminTableRow user={user} selected={selected} 
														key={user.id} selectUser={this.selectUser.bind(this, user)}/>)
								})}
							</tbody>

						</table>
						</div>
						</div>
				</div>
			</div>
			);
	}
};

module.exports = AdminPage;