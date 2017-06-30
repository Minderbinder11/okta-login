// appLink.jsx

import React from 'react';
import './appLink.css';

class AppLink extends React.Component {

	constructor (props){
		super(props);
	}

	render() {

		return (
			<li className="user-apps">	
        <div className="app-tile row text-centered">
          <img className="center-block" src={this.props.app.logoUrl}/>
        </div>
      </li>
			);
	}
}

AppLink.propTypes = {
	app: React.PropTypes.object.isRequired
};

module.exports = AppLink;