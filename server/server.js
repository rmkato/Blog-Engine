const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const validator = require("validator");
const cors = require("cors");

const User = require('./models/user');
const Post = require('./models/post');

mongoose.connect('mongodb://127.0.0.1:27017/blog-app-login', { useNewUrlParser: true, useUnifiedTopology: true });
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
	var user = new User({
		firstName: req.body.firstname,
		lastName: req.body.lastname,
		email: req.body.email,
		password: req.body.password
	}).save((err, response) => {
		if (err) {
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
		res.status(200).send(response);
	})
});

app.post('/user/login', (req, res) => {
	console.log("Received sign in request");
	User.findOne({'email': req.body.email}, (err, user) => {
		if (!user) {
			return res.status(401).send({
				message: 'email is not registered'
			})
		}
		
		// Compare password
		user.comparePassword(req.body.password, (error, isMatch) => {
			if (error) res.status(401).send(error);
			if (!isMatch) return res.status(401).send({
				message: 'password is incorrect'
			});
			res.status(200).send({
				'firstname': user.firstName,
				'lastname': user.lastName
			})
		})
	})
});

//app.post('user/delete')

app.post('/post/retrieve', (req, res) => {
	Post.find({}, function(err, posts) {
		if (err) return res.status(400).send(err)
		res.status(200).send(posts);
	})
});

app.post('/post/create', (req, res) => {
	console.log("Received post creation request");
	var post = new Post({
		title: req.body.title,
		content: req.body.content,
		date: req.body.date,
		user: req.body.user
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
			content: req.body.content	
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
