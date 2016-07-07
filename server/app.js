'use strict';

const http = require('http');
const https = require('https');
var aws4 = require('aws4');
const auth = require('./middleware/auth');
const window = require('./middleware/window');
const aliases = require('./middleware/aliases');
const dashboards = require('./lib/dashboards');
const express = require('@financial-times/n-express');
const cookieParser	= require('cookie-parser');
const mouseflow = require('./api/mouseflow');
const bodyParser = require('body-parser');

const app = module.exports = express({
	layoutsDir: __dirname + '/../views/layouts',
	withBackendAuthentication: false,
	withFlags: false,
	withHandlebars: true
});

// Indicates the app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client. NOTE: X-Forwarded-* headers are easily spoofed and the detected IP addresses are unreliable.
// See: http://expressjs.com/api.html
app.enable('trust proxy');

app.get('/__gtg', function (req, res) {
	res.send(200);
});

app.get('/__debug-ssl', function(req, res) {
	res.json({
		protocol: req.protocol,
		headers: req.headers
	});
});

app.get('/hashed-assets/:path*', function(req, res) {
	const path = 'http://ft-next-hashed-assets-prod.s3-website-eu-west-1.amazonaws.com' + req.path;
	http.get(path, function(proxyRes) {
		proxyRes.pipe(res);
	});
});

app.get(cookieParser());

app.get(auth);
app.get(window);
app.get(aliases.init);
app.get(dashboards.middleware);

try {
	const worker = require('fs').readFileSync(require('path').join(process.cwd(), 'public/worker.js'), 'utf8');
	app.get('/worker.js', function (req, res) {
		res.set('Content-Type', 'text/javascript')
		res.send(worker);
	})
} catch (err) {
	console.log('Error. Did you forget to run `Make build`?\n', err)
}

app.get(/^\/data\/keen-proxy\/(.*)/, require('./controllers/data/keen-proxy'));
app.get('/data/export/:limit', require('./controllers/data/export'));
app.get('/data/extract/:event_collection?/:event_properties?', require('./controllers/data/extract'));

app.get('/data/explorer', function(req, res) {
	res.render('keen', {
		layout: null,
		title: 'Data explorer',
		projectId: process.env.KEEN_PROJECT_ID,
		readKey: process.env.KEEN_READ_KEY,
		masterKey: process.env.KEEN_MASTER
	});
});

app.get('/data/query-wizard', function(req, res) {
	res.render('query-wizard', {
		layout: 'beacon',
		title: 'Query wizard',
		collections: {}
	});
});

// pipe through to an AWS bucket containing Redshift exports
app.get('/data/reports/*', function(req, res) {
	var signed = aws4.sign({
		service: 's3',
		hostname: process.env.S3_HOST,
		path: '/' + req.params[0],
		signQuery: true,
		region: 'eu-west-1',
	}, {
		accessKeyId: process.env.S3_AWS_ACCESS,
		secretAccessKey: process.env.S3_AWS_SECRET
	});
	https.get(signed, function(proxyRes) {
		proxyRes.pipe(res);
	});
});

app.get('/user', require('./controllers/user'));
app.get(/^\/dashboard\/(.*)/, require('./controllers/dashboard'));

app.get(/^\/chart\/(.*)/, function (req, res, next) {
  req.view = 'chart';
  next();
}, require('./controllers/dashboard'));

app.get(/^\/presentation\/(.*)/, function (req, res, next) {
  req.view = 'presentation';
  next();
}, require('./controllers/dashboard'));

app.get('/', function (req, res, next) {
  req.params[0] = 'overview';
  next();
}, require('./controllers/dashboard'));

app.use(bodyParser.json());
app.post('/api/mouseflow', mouseflow);

aliases.poll()
app.listen(process.env.PORT);
