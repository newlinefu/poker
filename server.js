const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const server = http.createServer((require, response) => {
	let contentType = 'text/html';
	let actualExt = path.parse(require.url)['ext'];
	let actualUrl = require.url === '/' ? '/index.html' : require.url;
	if(actualExt === '.css')
		contentType = 'text/css';
	else if(actualExt === '.js')
		contentType = 'text/javascript';
	else if(actualExt === '.jpeg')
		contentType = 'image/jpeg';

	response.writeHead(200, {
		'Content-Type': contentType
	});
	if(actualExt === '.ico'){
		response.end();
	} else {
		fs.readFile(path.join(__dirname, actualUrl), (e, data) => {
			if(e)
				throw e;
			else
				response.end(data);
		});
	}
});


server.listen(3000, () => {
	console.log('Server has been started');
});
