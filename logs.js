var faunadb = require("faunadb");
var q = faunadb.query;
const express = require("express");
const post = express();
const functions = require('firebase-functions')
;
var bodyParser = require("body-parser");
const port = 8000;
const { Functions, SelectAll } = require("faunadb");
post.use(
	bodyParser.urlencoded(
	{
		extended: true,
	})
);
post.use(bodyParser.json());
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
	Call,
	Function: Fn
} = faunadb.query;

post.listen(port, () =>
{
	console.log(`ballgrid listening on port ${port}!`)
});


var serverClient = new faunadb.Client(
{
	secret: "fnAEUjam_jACROrHOcRiizqIqeaRtGcJm8cHSMSR",
});



function sendNotificaiton(notiToken, title, body){

	const fetch = require('node-fetch');
	let todo = {
		to: notiToken,
		title: title,
		body: body
	};
	
	fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		body: JSON.stringify(todo),
		headers: { 'Content-Type': 'application/json' }
	}).then(res => res.json())
	  .then(json => console.log(json));
}

async function testAuth(token)
{
	//req.headers['authorization']
	if (token)
	{
		return await admin
			.auth()
			.verifyIdToken(token)
			.then(function()
			{
				return Promise.resolve(true);
			})
			.catch(function()
			{
				return Promise.resolve(false);
			});
	}
	else
	{
		return false;
	}
}

function removeItemOnce(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
	  arr.splice(index, 1);
	}
	return arr;
  }

post.post("/createLog", function(req, res)
{
	async function ok()
	{
		
		if (true)
		{
			serverClient
				.query(
					q.Create(q.Collection("Logs"),
					{
						data: req.body,
					})
				)
				.then((ret) => console.log(ret))
				.catch((err) => console.error("Error: %s", err));
			res.send(
			{
				status: 200,
			});
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			});
		}
	}
	ok();
});

post.post("/searchLogs", function(req, res)
	{
		async function ok()
		{
		
			if (true)
			{
				async function hitFauna()
				{
					let results = []

					let search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "access"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "flairs"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "timestamp"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "title"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					res.send(results);
				}

			    hitFauna();
			}
			else
			{
				res.send(
				{
					status: 400,
					info: "authorization failed"
				});
			}
		}
		ok();
	}),

	post.post("/changeStatus", function(req, res){

		async function bro(){

			const newStatus = req.body.status

			serverClient.query(
				q.Update(
					q.Ref(q.Collection("Logs"), req.body.ref),
					{
						data: {
							status : newStatus
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
		bro()
		

	})
	post.get("/getLog", function(req, res)
	{
		async function ok()
		{
			
			if (true)
			{
				async function retPost()
				{
					return serverClient.query(q.Get(q.Ref(q.Collection("Logs"), req.body.ref)));
				}
				async function consRes()
				{
					try
					{
						const faunaRes = await retPost();
						res.send(
						{
							status: 200,
							info: faunaRes,
						});
					}
					catch (err)
					{
						res.send(
						{
							status: 400,
							info: err,
						});
					}
				}
				consRes();
			}
			else
			{
				res.send(
				{
					status: 400,
					info: "authorization failed"
				});
			}
		
		}
		ok();
	});

	post.post('/getAllLogs', function(req, res){
    async function bruh () {
		return serverClient.query(
		q.Map(
			q.Paginate(q.Match(q.Index('logSearch'))),
			q.Lambda(x => q.Get(x))
		  )
	)}
	async function yo(){
	let ye = await bruh()
    res.send(ye)

	}
	yo()
	})


	post.post('/deleteComment', function(req, res){
		async function getuser(ref) // req.body.ref
		{
			return serverClient.query(
				q.Get(q.Ref(q.Collection('Posts'), ref))
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
						const comments = post.data.comments;
						const deleteComment= req.body.comment;
						const indexNum = comments.indexOf(deleteComment);
						console.log(indexNum)
						const newCommentList = removeItemOnce(comments, deleteComment);
						serverClient.query(
								q.Update(
									q.Ref(q.Collection("Logs"), req.body.ref),
									{
										data: {
											comments : newCommentList
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

	post.post('/addComment', function(req, res){ 
		async function getuser(ref) // req.body.ref
		{
			return serverClient.query(
				q.Get(q.Ref(q.Collection('Logs'), ref))
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
						const oldComments = post.data.comments;
						const newComment= req.body.comment;
						const newCommentList = await serverClient.query(q.Append(oldComments, newComment));
						
						serverClient.query(
								q.Update(
									q.Ref(q.Collection("Logs"), req.body.ref),
									{
										data: {
											comments : newCommentList,
										  [req.body.userThatCreatedPost] : newRappor // this method works
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


	post.post('/addLike', function(req, res){
		async function getuser(ref) // req.body.ref
		{
			return serverClient.query(
				q.Get(q.Ref(q.Collection('Logs'), ref))
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
						const oldLikes = post.data.likes;
						const newLikes= oldLikes + 1;
						serverClient.query(
								q.Update(
									q.Ref(q.Collection("Logs"), req.body.ref),
									{
										data: {
											likes : newLikes
										},
									},
								)
							)
							.then(
								sendNotificaiton(req.body.notiToken), 
							    res.send({status:200})
							)
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

	post.post('/removeLike', function(req, res){
		async function getuser(ref) // req.body.ref
		{
			return serverClient.query(
				q.Get(q.Ref(q.Collection('Logs'), ref))
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
						const oldLikes = post.data.likes;
						const newLikes= oldLikes - 1;
						serverClient.query(
								q.Update(
									q.Ref(q.Collection("Logs"), req.body.ref),
									{
										data: {
											likes : newLikes
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

post.post("/updateLog", function(req, res)
{
	async function ok()
	{
		if (true)
		{
			async function uzumaki()
			{
				try
				{
					serverClient
						.query(
							q.Update(q.Ref(q.Collection("Logs"), req.body.ref),
							{
								data: req.body,
							})
						)
						.then((sucess) =>
							res.send(
							{
								status: 200,
								info: sucess,
							})
						)
						.catch((problem) =>
							res.send(
							{
								status: 400,
								info: problem,
							})
						);
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err,
					});
				}
			}
			uzumaki();
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			});
		}
	}
	ok();
});

post.post("/deleteLog", function(req, res)
{
	async function ok()
	{
	
		if (true)
		{
			async function deleter()
			{
				try
				{
					serverClient
						.query(q.Delete(q.Ref(q.Collection("Logs"), req.body.ref)))
						.then((sucess) =>
							res.send(
							{
								status: 200,
							})
						)
						.catch((issue) =>
							res.send(
							{
								status: 400,
							})
						);
				}
				catch (err)
				{
					res.send(
					{
						status: 400,
						info: err,
					});
				}
			}
			deleter();
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "authorization failed"
			});
		}
	}
	ok();
});


post.post("/searchLog", function(req, res)
	{
		async function ok()
		{
		
		
				async function hitFauna()
				{
					let results = []

					let search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "access"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "uid"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "timestamp"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "title"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					results.push(search.data)

					
					search = await serverClient.query(
						Map(Filter(Paginate(Match(Index("logSearch"))), Lambda("postSearch", ContainsStr(LowerCase(Select(["data", "organization"], Get(Var("postSearch")))), req.body.term))), Lambda("postSearch", Get(Var("postSearch"))))
					);
					 results.push(search.data) // to search by org you have to use only lowercase letters. it wont work otherwise. 

					




					res.send(results);
				}

			    hitFauna();
			
			
		}
		ok();
	}),

exports.post = functions.https.onRequest(post)