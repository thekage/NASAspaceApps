var faunadb = require('faunadb')
var q = faunadb.query;
const express = require('express')
const functions = require('firebase-functions')
const app = express();
var bodyParser = require('body-parser')
const port = 8000;
app.use(bodyParser.urlencoded(
{
	extended: true
}))
app.use(bodyParser.json())
const
{
	Ref,
	Map,
	Lambda,
	Filter,
	Paginate,
	Get,
	Match,
	Index,
	Create,
	Collection,
	Join,
	ContainsStr,
	LowerCase,
	Var,
	Select,
	Append,
	Call,
	Function: Fn,
} = faunadb.query;

var serverClient = new faunadb.Client(
{
	secret: 'fnAEUjam_jACROrHOcRiizqIqeaRtGcJm8cHSMSR'
});





function removeItemOnce(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
	  arr.splice(index, 1);
	}
	return arr;
  }

async function testAuth(token)
{ //req.headers['authorization']
	if (token)
	{

		return await admin
			.auth()
			.verifyIdToken(token)
			.then(function()
			{
				return Promise.resolve(true)
			})
			.catch(function()
			{
				return Promise.resolve(false)
			})
	}
	else
	{
		return false
	}

}

async function getUserDoc(ref){
	return serverClient.query(
		q.Get(q.Ref(q.Collection('Users'), ref))
		)
}



app.post('/getUserByFireBaseID', function(req,res){
	async function getUser() {
		let bruh = await serverClient.query(
			Paginate(Match(Index("searchUserByFirebaseID"), req.body.firebaseToken))
		)
		console.log(bruh)
		let user = await serverClient.query(
			Get(bruh.data[0])
		)
		res.send(user.data)
	}
	getUser()
})

app.post('/createUser', function(req, res)
{
	async function ok()
	{
		
		if (true)
		{
			serverClient.query(
					q.Create(
						q.Collection('Users'),
						{
							data: req.body
						},
					)
				)
				.then((ret) => console.log(ret))
				.catch((err) => console.error('Error: %s', err))
			res.send(
			{
				status: 200
			});
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			})
		}
	}
	ok()
});

app.post('/acceptFriendRequest', function(req, res){
	async function getuser(ref) // req.body.ref
	{
		return serverClient.query(
			q.Get(q.Ref(q.Collection('Users'), ref))
			)
	}

	async function ok()
	{
		if (true)
		{
			async function updater()
			{
				try
				{
					const post = await getuser(req.body.ref);
					const oldFriendRequests = post.data.friendRequests;
					const friendList = post.data.friends;
					const newFriendRequests = await removeItemOnce(oldFriendRequests, req.body.friendReq)
					const friend = req.body.friend;
					const newFriendList = await serverClient.query(q.Append(friendList, friend));
					console.log(newFriendRequests)
					serverClient.query(
							q.Update(
								q.Ref(q.Collection("Users"), req.body.ref),
								{
									data: {
										friends : newFriendList,
										friendRequests : newFriendRequests
									},
								},
							)
						)
						.then(sucess => res.send(
						{
							status: 200,
							info: sucess
						}))
						.catch(error => res.send(
						{
							status: 400,
							info: error
						}))
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err
					})
				}
			}
			updater()
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			})
		}
	}
	ok()

});



app.post('/denyFriendRequest', function(req, res){
	async function getuser(ref) // req.body.ref
	{
		return serverClient.query(
			q.Get(q.Ref(q.Collection('Users'), ref))
			)
	}

	async function ok()
	{
		if (true)
		{
			async function updater()
			{
				try
				{
					const post = await getuser(req.body.ref);
					const oldFriendRequests = post.data.friendRequests;
					const newFriendRequests = await removeItemOnce(oldFriendRequests, req.body.deniedFriendRequest)
					console.log(newFriendRequests)
					serverClient.query(
							q.Update(
								q.Ref(q.Collection("Users"), req.body.ref),
								{
									data: {
										friendRequests : newFriendRequests
									},
								},
							)
						)
						.then(sucess => res.send(
						{
							status: 200,
							info: sucess
						}))
						.catch(error => res.send(
						{
							status: 400,
							info: error
						}))
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err
					})
				}
			}
			updater()
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			})
		}
	}
	ok()

});



app.post('/removeFriend', function(req, res){
	async function getuser(ref) // req.body.ref
	{
		return serverClient.query(
			q.Get(q.Ref(q.Collection('Users'), ref))
			)
	}

	async function ok()
	{
		if (true)
		{
			async function updater()
			{
				try
				{
					const post = await getuser(req.body.ref);
					const oldFriendRequests = post.data.friends;
					const newFriendList = await removeItemOnce(oldFriendRequests, req.body.removedFriend)
					console.log(newFriendRequests)
					serverClient.query(
							q.Update(
								q.Ref(q.Collection("Users"), req.body.ref),
								{
									data: {
										friends : newFriendList
									},
								},
							)
						)
						.then(sucess => res.send(
						{
							status: 200,
							info: sucess
						}))
						.catch(error => res.send(
						{
							status: 400,
							info: error
						}))
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err
					})
				}
			}
			updater()
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			})
		}
	}
	ok()

});




app.post('/sendFriendRequest', function(req, res){
	async function getuser(ref) // req.body.ref
	{
		return serverClient.query(
			q.Get(q.Ref(q.Collection('Users'), ref))
			)
	}

	async function ok()
	{
		if (true)
		{
			async function updater()
			{
				try
				{
					const post = await getuser(req.body.ref);
					const oldFriendRequests = post.data.friendRequests;
					const newFriendRequest= req.body.friendRequest;
					const newFriendList = await serverClient.query(q.Append(oldFriendRequests, newFriendRequest));
					serverClient.query(
							q.Update(
								q.Ref(q.Collection("Users"), req.body.ref),
								{
									data: {
										friendRequests : newFriendList
									},
								},
							)
						)
						.then(sucess => res.send(
						{
							status: 200,
							info: sucess
						}))
						.catch(error => res.send(
						{
							status: 400,
							info: error
						}))
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err
					})
				}
			}
			updater()
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			})
		}
	}
	ok()

});


app.post('/searchUser', function(req, res)
	{
		async function ok()
		{
			
			if (true)
			{
				console.log(req.body.term)
				async function hitFauna()
				{
					const searchUser = await serverClient.query(
						Map(
							Filter(
								Paginate(Match(Index("searchUser"))),
								Lambda("userRef",
									ContainsStr(
										LowerCase(Select(["data", "name"], Get(Var("userRef")))),
										req.body.term
									)
								)
							),
							Lambda("userRef", Get(Var("userRef")))
						)
					)
					console.log(searchUser)
					res.send(searchUser)
				}

				hitFauna()
			}
			else
			{
				res.send(
				{
					status: 400,
					info: "authorization failed"
				})
			}
		}
		ok()

	}),



	app.get('/getUser', function(req, res)
	{
		async function ok()
		{
			
			if (true)
			{
				async function getuser()
				{
					return serverClient.query(
						q.Get(q.Ref(q.Collection('Users'), req.body.ref))
					)
				}
				async function res()
				{
					try
					{
						const faunaRes = await getuser()
						res.send(
						{
							status: 200,
							info: faunaRes
						})
					}
					catch (err)
					{
						res.send(
						{
							status: 400,
							info: err
						})
					}
				}
				res()
			}
			else
			{
				res.send(
				{
					status: 400,
					info: "authorization failed"
				})
			}
		}
		ok()
	});

	app.post('/getFriendRequests', function(req, res){
	async function pullRequests(){

		try {

		const Requests = await getUserDoc(req.body.ref)
		const List = Requests.data.friendRequests;
		res.send(List)
			
		} catch (error) {
			
			res.send({status:400, info: error})

		}
		

		}
		pullRequests()
	})



app.post('/updateUser', function(req, res)
{
	async function ok()
	{
		
		if (true)
		{
			async function updater()
			{
				try
				{
					serverClient.query(
							q.Update(
								q.Ref(q.Collection("Users"), req.body.ref),
								{
									data: req.body
								},
							)
						)
						.then(sucess => res.send(
						{
							status: 200,
							info: sucess
						}))
						.catch(error => res.send(
						{
							status: 400,
							info: error
						}))
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err
					})
				}
			}
			updater()
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			})
		}
	}
	ok()
});

app.post('/deleteUser', function(req, res)
{
	async function ok()
	{
		
		if (true)
		{
			async function deleter()
			{
				try
				{
					serverClient.query(
							q.Delete(
								q.Ref(q.Collection("Users"), req.body.ref)
							)
						)
						.then(sucess => res.send(
						{
							status: 200
						}))
						.catch(problem => res.send(
						{
							status: 400
						}))
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err
					})
				}
			}
			deleter()
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			})
		}
	}
	ok()
});

exports.app = functions.https.onRequest(app)