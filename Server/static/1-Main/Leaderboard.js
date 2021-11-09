let JSONString
fetch("Scores.json")
	.then(response => response.json())
	.then(data =>{
		(JSONString = JSON.parse(JSON.stringify(data)));
		//document.getElementById("tableL").innerHTML = (JSONString)
		
	}).then(() => { //Fetch is asynchronous so the leaderboard production has to be behind "then"
		console.log(JSONString)
		const List = document.getElementById("highscores");
	
		console.log(JSONString.length)
	
		for(let i=0; i < JSONString.length; i++){
			console.log(JSONString[i])
			let li = document.createElement("LI");
			let text = document.createTextNode(JSONString[i].name + " - " + JSONString[i].score)
			li.appendChild(text)
			List.appendChild(li)
		}
	})

	//localStorage.setItem('gameStorage', JSON.stringify(JSONString)); 




/*
function tableCreate(){
	const List = document.getElementById("highscores");
	let valuesJSON = JSON.parse(JSON.stringify(scores));
	let lowestScore = valuesJSON[valuesJSON.length-1].score;//IDFK GAAAAAAAAAAAAAAAAAAAAAA
	document.getElementById("lowscore").value = lowestScore

	console.log(valuesJSON.length)

	for(let i=0; i < valuesJSON.length; i++){
		console.log("why")
		console.log(valuesJSON[i])
		let li = document.createElement("LI");
		let text = document.createTextNode(valuesJSON[i].name + " - " + valuesJSON[i].score)
		li.appendChild(text)
		List.appendChild(li)
	}
}*/


/* const http = require('http')
const port = 8080
const server = http.createServer(function(req, res) {

	res.write('heya!')
	res.end()
})

server.listen(port, function(error){
	if(error){
		console.log("something is wrong", error)
	}else{
		console.log("listening on " + port)
	}
})
*/