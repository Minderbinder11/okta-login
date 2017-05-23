// appLink.jsx

import React from 'react';

class AppLink extends React.Component {

	constructor (props){
		super(props);
	}


	render() {

		return (
			<li className="user-apps">
        <a href={this.props.app.linkUrl} target="blank">
          <img src={this.props.app.logoUrl}/>
        </a>
      </li>
			);
	}
}

module.exports = AppLink;