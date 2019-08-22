module.exports = {
	secure: true,
	token: process.env.ACCESS_TOKEN,
	appId: process.env.APP_ID,
	secret: process.env.APP_SECRET,
	group_id: process.env.GROUP_ID,
	crop_x2: process.env.CROP_X,
	crop_y2: process.env.CROP_Y,
	timeout: process.env.DELAY_TIME,
	imgsDir: process.env.IMG_DIR,
};
