//adminTableRow.jsx

import React from 'react';
import { Link } from 'react-router-dom';

class AdminTableRow extends React.Component {

	constructor(props) {
		super(props);
		this.state = { selected: this.props.selected };
		this.selectRow = this.selectRow.bind(this);
	}

	selectRow(e) {
		e.preventDefault();
		this.setState({selected: !this.state.selected});
		this.props.selectUser();
	}

	render () {
		var classes = '';

		if(this.props.selected) {
			classes = "table-row selected-row"
		} else{
			classes = "table-row"
		}

		return (
			<tr onClick={this.selectRow} className={classes}>
				<td className="col-md-6"><Link to={{pathname: '/updateUser/' + this.props.user.id}}>
					{this.props.user.profile.firstName} {this.props.user.profile.lastName}</Link>
				</td>
				<td className="col-md-4">{this.props.user.profile.email}</td>
				<td className="col-md-2">{this.props.user.status}</td>	
			</tr>
			);
	}
}

module.exports = AdminTableRow;