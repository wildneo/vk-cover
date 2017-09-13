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
		delay: minutesToMilliseconds(process.env.DELAY_TIME),
		current: getCurrentTime()
	},
	img: {
		name: 'cover_',
		format: '.png',
		path: '/img/'
	}
};

function getCurrentTime() {
	var date = new Date();
	var h = addZero(date.getHours());
	var m = addZero(date.getMinutes());
	var s = addZero(date.getSeconds());
	var time = '[' + h + ':' + m + ':' + s + ']';
	return time;
}

function addZero(i) {
	if (i < 10) i = "0" + i;
	return i;
}

function minutesToMilliseconds(i) {
	i = i * 60 * 1000;
	return i;
}