'use strict'

exports.handler = async () => {
  const data = getData();
  const dataString = getDataString(data);
  const csvString = await getCSVString(data);
  const zipData = await getZipData(csvString);
  const fileName = getFileName();
  const bucketName = process.env.BUCKET_NAME;
  await putS3(zipData, fileName, bucketName);
};

const getData = () => {
  let data = [];
  data.push({
    id: 'a',
    name: 'i'
  });
  data.push({
    id: 'u',
    name: 'e'
  });
  return data;
};

const getDataString = (data) => {
  return JSON.stringify(data);
};

const getCSVString = (data) => {
  const CSV = require('csv-string');
  return CSV.stringify(data);
};

const getFileName = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes(); 
  const seconds = date.getSeconds();
  const fileName = hours + ':' + minutes + ':' + seconds + '.zip';

  console.log(fileName);

  return fileName;
};

const getZipData = (data) => {
  const zlib = require('zlib');

  return new Promise((resolve, reject) => {
    zlib.gzip(data, (err, binary) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        console.log('success create zip file');
        resolve(binary);
      }
    });
  });
};

const putS3 = (data, fileName, bucketName) => {
  const AWS = require('aws-sdk');
  const s3 = new AWS.S3();
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: data
  };

  return new Promise((resolve, reject) => {
    s3.putObject(params, (err, data) => {
      if (err) {
        console.log(err);
        reject();
      } else {
        console.log('put success!!');
        resolve();
      }
    });
  });
};
