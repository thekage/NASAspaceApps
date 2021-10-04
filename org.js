var faunadb = require("faunadb");
var q = faunadb.query;
const express = require("express");
const message = express();
const functions = require('firebase-functions');
var bodyParser = require("body-parser");
const port = 8000;

message.use(bodyParser.json());
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


var serverClient = new faunadb.Client(
{
	secret: "fnAEUkPE6vACRRCKFATcURZ9hVmLmmC1bS4s2yRS",
});


function removeItemOnce(arr, value) {
	var index = arr.indexOf(value);
	if (index > -1) {
	  arr.splice(index, 1);
	}
	return arr;
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

message.post("/createMessage", function(req, res)
{
	
	async function getuser(ref) // req.body.ref
		{
			return serverClient.query(
				q.Get(q.Ref(q.Collection('Organizations'), ref))
				)
		}
    
	async function sendMessage()
	{
		
		if (true)
		{
			const post = await getuser(req.body.ref);  
						const oldComments = post.data.messages;
						const newComment= req.body.message;
						const newMessageList = await serverClient.query(q.Append(oldComments, newComment));
						console.log(newMessageList)
			serverClient
				.query(
					q.Create(q.Collection("ChatMessages"),
					{
						data: req.body,
					})
				)	
			.then(
							serverClient.query(
								q.Update(
									q.Ref(q.Collection("ChatRooms"), req.body.ref), // ref of the chat room
									{
										data: {
											messages : newMessageList  // this method works
										},
									},
								)
							)
			)
			.then(res.send({status:200, info:"message sent!"}))
			.catch(res.send({status:400, info : "message failed to send"}));
			
		}
		else
		{
			res.send(
			{
				status: 400,
				info: "Message Failed to send"
			});
		}
	}
    sendMessage();

           


});


message.post('/changeOrganizatioName', function(req, res){ 

	async function ok()
	{
		if (true)
		{
			async function updater()
			{
				try
				{
					const newName= req.body.name;
					
					serverClient.query(
							q.Update(
								q.Ref(q.Collection("Organizations"), req.body.ref),
								{
									data: {
										name : newName
									
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


message.post('/changeOrganizationImage', function(req, res){ 

	async function ok()
	{
		if (true)
		{
			async function updater()
			{
				try
				{
					const newImage= req.body.image;
					
					serverClient.query(
							q.Update(
								q.Ref(q.Collection("Organizations"), req.body.ref),
								{
									data: {
										image : newImage
									
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

message.post("/getOrganizationLogs", function(req, res) // send in the ref of the chatroom
{

	async function getuser(ref) // req.body.ref
	{
		return serverClient.query(
			q.Get(q.Ref(q.Collection('Organizations'), ref))
			)
	} 
async function getData(){

	const chatRoom = await getuser(req.body.ref)
	const messages = chatRoom.data.messages;
    res.send(messages)

}
getData()

})



message.post("/createOrganization", function(req, res)
{
 
	async function createRoom()
	{
		
		if (true)
		{
			serverClient
				.query(
					q.Create(q.Collection("Organizations"),
					{
						data: req.body,
					})
				)
				.then((ret) => console.log(ret) )
				.catch((err) => console.error("Error: %s", err));
			res.send(
			{
				status: 200,
                info: "Group Created!"
			});
		}
		else
		{
			res.send(
			{
				status: 400,
				info: err
			});
		}
	}

    createRoom();
});

message.post("/deleteOrganization", function(req, res)
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
						.query(q.Delete(q.Ref(q.Collection("ChatRooms"), req.body.ref)))
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


message.post("/addOrganizationMember", function(req, res){// adds a member to the chatroom. Specifically the ref of that member will be stored. Send the ref as an array of one term

	async function getuser(ref) // req.body.ref
		{
			return serverClient.query(
				q.Get(q.Ref(q.Collection('Organizations'), ref))
				)
		}
	
		async function member()
		{
			if (true)
			{
				async function addMember()
				{
					try
					{
						const post = await getuser(req.body.ref);
						const oldMember = post.data.members;
						const newMember = req.body.member;
						const newMemberList = await serverClient.query(q.Append(oldMember, newMember));
						
						serverClient.query(
								q.Update(
									q.Ref(q.Collection("Organizations"), req.body.ref),
									{
										data: {
											members : newMemberList,
										   // this method works
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
				addMember()
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
		member()
	
	});

	message.post('/removeOrganizationLog', function(req, res){
		async function getuser(ref) // req.body.ref // send in the ref of the member as a string instead. 
		{
			return serverClient.query(
				q.Get(q.Ref(q.Collection('Organizations'), ref))
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
						const comments = post.data.members;
						const deleteComment= req.body.member;
						const indexNum = comments.indexOf(deleteComment);
						console.log(indexNum)
						const newCommentList = removeItemOnce(comments, deleteComment);
						serverClient.query(
								q.Update(
									q.Ref(q.Collection("Organizations"), req.body.ref),
									{
										data: {
											members : newCommentList
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



exports.message = functions.https.onRequest(message)