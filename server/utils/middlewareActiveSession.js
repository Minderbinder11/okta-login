// middlewareActiveSession.js

// this secure all routes to make sure the user has an active session.

module.exports = (req, res, next) => {
	if (req.session.userId) {
		res.send({status: 'ACTIVE'})
		next();
	} else {
		res.send({status: 'INACTIVE'})
		next();
	}
}