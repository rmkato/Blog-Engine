const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const validator = require("validator");
const cors = require("cors");
const cryptoJS = require("crypto-js");

const User = require('./models/user');
const Post = require('./models/post');

mongoose.connect('mongodb://127.0.0.1:27017/blog-app-login', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('connected', () => {
	console.log('connected to mongodb');
})
db.on('disconnected', () => {
	console.log('disconnected from mongodb');
})


// PORT
const app = express();
app.use(bodyParser.urlencoded());
app.use(cors());

const port = process.env.PORT || 4000;
app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

app.post('/user/signup', (req, res) => {
	console.log("Received sign up request");
	var cookie = createLoginCookie(req.body.firstName, req.body.lastName);
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		password: req.body.password,
		cookie: cookie.split(';')[0]
	}).save((err, response) => {
		if (err) {
			console.log("Signup unsuccessful: ", err);
			if (err.code == 11000) {
				return res.status(400).send({
					message: 'this email address has already been registered, please login instead.'
				})
			}
			else {
				return res.status(400).send({
					message: 'account registration error'
				});
			}
		} 
		console.log(`Sign up successful for ${req.body.firstName} ${req.body.lastName}\n`);
		res.status(200).send({
			'firstName': req.body.firstName,
			'lastName': req.body.lastName,
			'email': req.body.email,
			'accountCreationSuccess': true,
			'cookie': cookie
		});
	});
});

app.post('/user/login', (req, res) => {
	console.log("Received sign in request");
	// Verify that account exists for email
	User.findOne({'email': req.body.email}, (err, user) => {
		if (!user) {
			return res.status(401).send({
				message: 'email is not registered'
			});
		}
		// Compare password
		user.comparePassword(req.body.password, (error, isMatch) => {
			if (error) return res.status(401).send(error);
			if (!isMatch) return res.status(401).send({
				message: 'password is incorrect'
			});
		});

		var cookie = createLoginCookie(user.firstName, user.lastName);
		console.log(cookie);
		User.findOneAndUpdate(
			{ 'email': req.body.email }, 
			{ 'cookie': cookie.split(';')[0] },
			(error, result) => {
				if (error) {
					console.log(error+'\n');
					res.status(401).send(error)
				}
				console.log("login successful\n");
			}
		)
		// Encrypt the cookie and send it to the client

		res.status(200).send({
			'firstName': user.firstName,
			'lastName': user.lastName,
			'cookie': cookie
		});
	});	
});

app.post('/user/verifyCookie', (req, res) => {
	// Check cookie against database
	console.log("verifying login cookie");
	User.findOne({'cookie': req.body.cookie}, (err, user) => {
		if (!user) {
			// No match found
			console.log("No match found for cookie\n");
			return res.status(401).send({
				message: 'cookie not found'
			});
		} else {
			// Match found; log user in and generate a new cookie
			var newCookie = createLoginCookie(user.firstName, user.lastName);
			User.findOneAndUpdate({ 'email': user.email }, { 'cookie': newCookie.split(';')[0] }, (err2)=>{
				if (err2) throw err2;
			});
			console.log("cookie verified\n");
			res.status(200).send({
				'firstName': user.firstName,
				'lastName': user.lastName,
				'email': user.email,
				'cookie': newCookie
			})
		}
	});
});

//app.post('user/delete')

app.post('/post/retrieve', (req, res) => {
	Post.find({}, function(err, posts) {
		if (err) return res.status(400).send(err)
		res.status(200).send(posts);
	});
});

app.post('/post/create', (req, res) => {
	console.log("Received post creation request\n");
	var post = new Post({
		title: req.body.title,
		content: req.body.content,
		date: req.body.date,
		user: req.body.user,
		email: req.body.email
	}).save((err, response) => {
		if (err) return res.status(400).send(err);
		res.status(200).send(response);
	})
});

app.post('/post/delete', (req, res) => {
	console.log("Received post deletion request");
	Post.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}, (err, response) => {
		if (err) return res.status(400).send(err);
		console.log("post " + req.body.id + " deleted\n");
		res.status(200).send(response);
	})
});

app.post('/post/update', (req, res) => {
	console.log("Received post update request");
	Post.findOneAndUpdate(
		{ 
			_id: new mongoose.Types.ObjectId(req.body.id) 
		}, 
		{ 
			title: req.body.title,
			content: req.body.content,
			date: req.body.date
		}, 
		(err, response) => {
			if (err) return res.status(400).send(err);
			console.log("post " + req.body.id + "updated\n");
			res.status(200).send(response);
		}
	);
});

app.listen(port, () => {
  console.log(`Server listening on Port ${port}`);
});

function createLoginCookie(firstName, lastName) {
	var user = firstName + ' ' + lastName;
	var token = cryptoJS.lib.WordArray.random(32).toString(cryptoJS.enc.Hex);
	var expiration = new Date();
	expiration.setTime(expiration.getTime() + (60*60*1000))
	var expiration_UTC = expiration.toUTCString();
	//var cookie = `${user}:${token}; expires=${expiration}`;
	var cookie = `login=${user}:${token}; expires=${expiration_UTC}`;
	return cookie; 
}