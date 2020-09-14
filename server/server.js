const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const validator = require("validator");
const cors = require("cors");

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
	console.log("Received sign up request\n");
	var user = new User({
		firstName: req.body.firstname,
		lastName: req.body.lastname,
		email: req.body.email,
		password: req.body.password
	}).save((err, response) => {
		if (err) res.status(400).send(err);
		res.status(200).send(response);
	})
});

app.post('/user/login', (req, res) => {
	console.log("Received sign in request\n");
	User.findOne({'email': req.body.email}, (err, user) => {
		if (!user) {
			res.json({message: 'Login failed, user not found\n'});
			return;
		}
		
		// Compare password
		user.comparePassword(req.body.password, (err, isMatch) => {
			if (err) res.status(400).send(err);
			if (!isMatch) return res.status(400).json({
				message: 'Password Incorrect'
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
	console.log("Received get posts request\n");
	Post.find({}, function(err, posts) {
		if (err) res.status(400).send(err)
		res.status(200).send(posts);
	})
});

app.post('/post/create', (req, res) => {
	var post = new Post({
		title: req.body.title,
		content: req.body.content,
		date: req.body.date,
		user: req.body.user
	}).save((err, response) => {
		if (err) res.status(400).send(err);
		res.status(200).send(response);
	})
});

app.post('/post/delete', (req, res) => {
	Post.deleteOne({_id: new mongoose.Types.ObjectId(req.body.id)}, (err, response) => {
		if (err) res.status(400).send(err);
		console.log("post " + req.body.id + " deleted\n");
		res.status(200).send(response);
	})
});

//app.post('/post/update', (req, res) => {});

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
