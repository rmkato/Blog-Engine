const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
const User = require('./models/user');
const Post = require('./models/post');
const cors = require("cors");
const cryptoJS = require("crypto-js");
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded());
app.use(cors());
const port = process.env.PORT || 4000;

const uri = "mongodb+srv://rkato1131:rkato00@cluster0.lkbi1.mongodb.net/blog-engine?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
var userCollection;
var postCollection;

async function connectToDB() {
	await client.connect((err) => {
		if (err) throw err;
		const db = client.db("blog-engine");
		userCollection = db.collection("user");
		postCollection = db.collection("post");
		console.log("Connected to db");
	});
}

async function closeConnectionToDB() {
	await client.close();
	console.log('connection closed');
}

async function runInsertion() {
	await connectToDB();
	await insertUser();
}

function createLoginCookie(firstName, lastName) {
	var user = firstName + ' ' + lastName;
	var token = cryptoJS.lib.WordArray.random(32).toString(cryptoJS.enc.Hex);
	var expiration = new Date();
	expiration.setTime(expiration.getTime() + (60*60*1000))
	var expiration_UTC = expiration.toUTCString();
	var cookie = `login=${user}:${token}; expires=${expiration_UTC}`;
	return cookie; 
}


app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});

app.post('/user/signup', (req, res) => {
	console.log("Received sign up request");
	var cookie;
	try {
		cookie = createLoginCookie(req.body.firstName, req.body.lastName);

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(req.body.password, salt, (error, hash) => {
				if (error) {
					console.log("Error:", error);
					return req.status(400).send(error);
				}
				var user = new User({
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					username: req.body.username,
					email: req.body.email,
					password: hash,
					cookie: cookie.split(';')[0]
				})
			
				userCollection.insertOne(user, (e, response) => {
					if (e) {
						console.log("Signup unsuccessful: ", e);
						if (e.code == 11000) {
							return res.status(400).send({
								message: 'this email address or username has already been registered, please login instead.'
							})
						}
						else {
							return res.status(400).send({
								message: 'account registration error'
							});
						}
					} 
				});
			})
		})
	} catch(e) {
		res.status(400).send(e);
	} finally {
		console.log(`Sign up successful for ${req.body.username}\n`);
		res.status(200).send({
			'username': req.body.username,
			'accountCreationSuccess': true,
			'cookie': cookie
		});
	}
});

app.post('/user/login', async (req, res) => {
	console.log("Received sign in request");
	// Verify that account exists for email
	try {
		userCollection.findOne({'username': req.body.username}, async (err, user) => {
			if (err || !user) {
				console.log("username not found");
				return res.status(401).send({
					message: 'username is not registered'
				});
			}

			// Compare password
			await bcrypt.compare(req.body.password, user.password, (error, isMatch) => {
				if (error) {
					console.log("error:", error);
					return res.status(401).send(error);
				}
				if (!isMatch){
					console.log("password is incorrect");
					return res.status(401).send({message: 'password is incorrect'});
				}
			});
			
			var cookie = createLoginCookie(user.firstName, user.lastName);
			console.log("created cookie for user:", req.body.username);
			console.log("cookie(before split):", cookie);
			console.log("cookie:", cookie.split(';')[0]);
			try {
				userCollection.findOneAndUpdate(
					{ 'username': req.body.username }, 
					{ $set: { 'cookie': cookie.split(';')[0] }},
					(error, result) => {
						if (error) {
							console.log(error+'\n');
							res.status(401).send(error)
						}
						console.log("cookie updated");
					}
				)
				res.status(200).send({
					'username': user.username,
					'cookie': cookie
				});
			} catch(e) {
				console.log(e);
			}
		})
	} catch(e) {
		console.log(e);
		res.status(400).send(e);
	}
});

app.post('/user/verifyCookie', (req, res) => {
	// Check cookie against database
	console.log("verifying login cookie");
	
	userCollection.findOne({'cookie': req.body.cookie}, (err, user) => {
		if (!user) {
			// No match found
			console.log("No match found for cookie\n");
			return res.status(401).send({
				message: 'cookie not found'
			});
		} else {
			console.log("cookie verified, user:", user.username);
			// Match found; log user in and generate a new cookie
			var newCookie = createLoginCookie(user.firstName, user.lastName);
			userCollection.findOneAndUpdate({ 'username': user.username }, { $set: { 'cookie': newCookie.split(';')[0] }}, (err2)=>{
				if (err2) throw err2;
			});
			res.status(200).send({
				'username': user.username,
				'cookie': newCookie
			})
		}
	});
});

//app.post('user/delete')

app.post('/post/retrieveAll', (req, res) => {
	console.log("Received post retrieval request");
	try {
		postCollection.find({}, (err, posts) => {
			if (err) {
				console.log("post retrieval failed\n");
				return res.status(400).send(err);
			}

			posts.toArray((err, result) => {
				if (!result || !result.length) {
					console.log("no posts found");
					return res.status(200).send([]);
				}
				res.status(200).send(result);
				console.log("posts found and sent to client");
			});
		})
	} catch(e) {
		console.log(e);
		res.status(400).send(e);
	}
});

app.post('/post/retrieveOne', (req, res) => {
	console.log("Received post retrieval request");
	try {
		postCollection.findOne({
			_id: new ObjectId(req.body.id)
		},
		(err, response) => {
			if (err) return res.status(400).send(err);
			console.log("post " + response._id + "retrieved\n");
			res.status(200).send(response);
		})
	} catch(e) {
		console.log(e);
		res.status(400).send(e);
	}
});

app.post('/post/create', (req, res) => {
	console.log("Received post creation request\n");
	try {
		var post = new Post({
			title: req.body.title,
			content: req.body.content,
			tags: req.body.tags,
			date: req.body.date,
			user: req.body.user
		})
		postCollection.insertOne(post, (err, response) => {
			if (err) return res.status(400).send(err);
			console.log("post successfully added");
			res.status(200).send(response)
		})
	} catch(e) {
		console.log(e);
		return res.status(400).send(e);
	}
});

app.post('/post/delete', (req, res) => {
	console.log("Received post deletion request");
	try {
		postCollection.deleteOne({_id: new ObjectId(req.body.id)}, (err, response) => {
			if (err) return res.status(400).send(err);
			console.log("post " + req.body.id + " deleted\n");
			res.status(200).send(response);
		})
	} catch(e) {
		console.log("error:", e);
		res.status(400).send(e);
	}
});

app.post('/post/update', (req, res) => {
	if (req.body.tags == undefined)
		req.body.tags = [];
	console.log("Received post update request", req.body.tags);
	try {
		postCollection.findOneAndUpdate(
			{ 
				_id: new ObjectId(req.body.id) 
			}, 
			{ 
				$set: { 
					title: req.body.title,
					content: req.body.content,
					tags: req.body.tags,
					date: req.body.date
				}
			}, 
			(err, response) => {
				if (err) return res.status(400).send(err);
				console.log("post " + req.body.id + "updated\n");
				res.status(200).send(response);
			}
		);
	} catch(e) {
		console.log("error:", e);
		res.status(400).send(e);
	}
});

connectToDB();

[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`].forEach(async (event) => {
	process.on(event, async () => {
		console.log(event);
		await closeConnectionToDB();
		process.exit();
	});
});

app.listen(port, () => {
	console.log(`Server listening on Port ${port}`);
});