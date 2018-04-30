// env.js
if (process.env.NODE_ENV === 'production') {
	// we are in production - return the prod env
	module.exports = require('./prod');
} else {
	// we are in development - return the dev env
	module.exports = require('./dev');
}
