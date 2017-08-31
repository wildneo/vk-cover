var fs = require('fs');
var vk = require('vksdk');
var rs = require('restler');

var vk = new vk({
	'appId': 6157753,
	'appSecret': 'sZ1VC3uH6O2b11Hd2He6'
});

var count = 1;

vk.setSecureRequests(true);
// vk.setToken('bc06e6c8dafcf113072df06bda164bc6163ceecd84cd309be45700a552b792b85d860b487590ba5315d0f');
vk.setToken('35c3145f836a38736fe3c58e5c88aee75d5783b3685d2c0fadfa1a76465c21bba3a3bb0e7599e88fbd2be');

function getUploadUrl() {
	vk.request('photos.getOwnerCoverPhotoUploadServer', {
	'group_id'	: 117271043,
	'crop_x2'	: 1590,
	'crop_y2'	: 400
	});
	console.log(getCurrentTime(), 'Sending request...');
}

function uploadCover(upload_url) {
	rs.post(upload_url, {
	multipart: true,
	data: {
		'photo': rs.file(__dirname + '/img/cover-' + count + '.jpg', null, fs.statSync(__dirname + '/img/cover-' + count + '.jpg').size, null, 'image/png')
	}
	}).on('complete', function(data) {
		saveCover(data);
	});
	console.log('Loading cover...');
}

function saveCover(data) {
	data = JSON.parse(data);
	vk.request('photos.saveOwnerCoverPhoto', {
		'hash' : data.hash,
		'photo' : data.photo
	});
	console.log('Save changes...');
}

function delay(t) {
	console.log('Wait...');
	setTimeout(getUploadUrl, t);
	if (count == 10) count = 0;
	count++;
	clearTimeout();
}

function addZero(i) {
	if (i < 10) i = "0" + i;
	return i;
}

function getCurrentTime() {
	var date = new Date();
	var h = addZero(date.getHours());
	var m = addZero(date.getMinutes());
	var s = addZero(date.getSeconds());
	var time = '[' + h + ':' + m + ':' + s + ']';
	return time;
}

vk.on('done:photos.getOwnerCoverPhotoUploadServer', function(result) {
	var err = result.error;
	if (err) {
		console.log(getCurrentTime(), 'Error:', err.error_code, err.error_msg );
	} else {
		var upload_url = result.response.upload_url;
		console.log('URL received');
		uploadCover(upload_url);
	}
});

vk.on('done:photos.saveOwnerCoverPhoto', function(result) {
	if (result.error) {
		console.log(getCurrentTime(), 'Error:', result.error.error_code, result.error.error_msg );
	} else {
		console.log(getCurrentTime(), 'Done');
		delay(3600000);
	}
});

console.log('Start!');
getUploadUrl();