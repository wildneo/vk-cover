const path = require('path');
const fs = require('fs');
const Vk = require('vksdk');
const restler = require('restler-base');
const config = require('./config');

const {
  appId, secure, appSecret, crop_x2, crop_y2, group_id,
} = config;

const vk = new Vk({ appId, secure, appSecret });
vk.setToken(config.token);

const imgs = fs.readdirSync(config.imgsDir);
let counter = 0;

const getFile = (fileName) => {
  const filePath = path.join(config.imgsDir, fileName);
  const fileSize = fs.statSync(filePath).size;
  const photo = restler.file(filePath, fileName, fileSize, 'binary', 'image/png');
  return { photo };
};

const saveCover = (result) => {
  const { hash, photo } = JSON.parse(result);
  const cb = ({ error }) => {
    if (error) {
      console.log(error.error_msg);
      return;
    }
    console.log('Cover saved');
  };
  vk.request('photos.saveOwnerCoverPhoto', { hash, photo }, cb);
};

const changeCover = (img) => {
  const cb = ({ error, response }) => {
    if (error) {
      console.log(error.error_msg);
      return;
    }
    console.log('Response received');
    restler.post(response.upload_url, {
      multipart: true,
      data: getFile(img),
    }).on('complete', saveCover);
  };
  vk.request('photos.getOwnerCoverPhotoUploadServer', { group_id, crop_x2, crop_y2 }, cb);
};

setInterval(() => {
  if (counter === imgs.length) {
    counter = 0;
  }
  changeCover(imgs[counter]);
  counter += 1;
}, config.timeout);
