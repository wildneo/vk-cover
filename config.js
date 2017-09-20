var fs = require('fs');

module.exports = {
	token: process.env.ACCESS_TOKEN,
	app: {
		id: process.env.APP_ID,
		secret: process.env.APP_SECRET
	},
	group: {
		id: process.env.GROUP_ID
	},
	cover: {
		height: 1590,
		width: 400
	},
	time: {
		delay: minutesToMilliseconds(process.env.DELAY_TIME)
	},
	img: {
		items: fs.readdirSync(__dirname + '/img/'),
		path: __dirname + '/img/',
		format: 'image/png'
	}
};

function minutesToMilliseconds(i) {
	i = i * 60 * 1000;
	return i;
}