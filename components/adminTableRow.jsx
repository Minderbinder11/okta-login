//adminTableRow.jsx

import React from 'react';

class AdminTableRow extends React.Component {

	constructor(props) {
		super(props);
		this.state = {selected: this.props.selected};
		this.selectRow = this.selectRow.bind(this);
	}

	selectRow(e) {
		e.preventDefault();
		this.setState({selected: !this.state.selected});
		this.props.selectUser();
	}

	render () {
		var classes = '';

		if(this.props.selected === this.props.user) {
			classes = "table-row selected-row"
		} else{
			classes = "table-row"
		}

		return (
			<tr onClick={this.selectRow} className={classes}>
				<td className="columnA">{this.props.user.profile.firstName} {this.props.user.profile.lastName}</td>
				<td className="columnB">{this.props.user.profile.email}</td>
				<td className="columnC">{this.props.user.status}</td>	
			</tr>
			);
	}

}

module.exports = AdminTableRow;