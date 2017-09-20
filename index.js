var fs = require('fs');
var vk = require('vksdk');
var rs = require('restler');
var config = require('./config');

var vk = new vk({
	'appId': config.app.id,
	'appSecret': config.app.secret
});

vk.setSecureRequests(true);
vk.setToken(config.token);

var counter = 0;

function getUploadUrl() {
	vk.request('photos.getOwnerCoverPhotoUploadServer', {
	'group_id'	: config.group.id,
	'crop_x2'	: config.cover.height,
	'crop_y2'	: config.cover.width
	});
	console.log('Sending request...');
}

function uploadCover(url) {
	rs.post(url, {
	multipart: true,
	data: {
		'photo': rs.file(config.img.path + config.img.items[counter], null, fs.statSync(config.img.path + config.img.items[counter]).size, null, config.img.format)
	}
	}).on('complete', function(result) {
		saveCover(result);
	});
	console.log('Loading cover...');
}

function saveCover(result) {
	result = JSON.parse(result);
	vk.request('photos.saveOwnerCoverPhoto', {
		'hash' : result.hash,
		'photo' : result.photo
	});
	console.log('Save changes...');
}

function delay() {
	console.log('Wait...');
	setTimeout(getUploadUrl, config.time.delay);
	if (counter == config.img.items.length - 1) counter = 0;
	else counter++;
	clearTimeout();
}

vk.on('done:photos.getOwnerCoverPhotoUploadServer', function(result) {
	var err = result.error;
	if (err) {
		console.log('Error:', err.error_code, err.error_msg );
	} else {
		var upload_url = result.response.upload_url;
		console.log('URL received');
		uploadCover(upload_url);
	}
});

vk.on('done:photos.saveOwnerCoverPhoto', function(result) {
	if (result.error) {
		console.log('Error:', result.error.error_code, result.error.error_msg );
	} else {
		console.log('Done');
		delay();
	}
});

console.log('Start!');
getUploadUrl();