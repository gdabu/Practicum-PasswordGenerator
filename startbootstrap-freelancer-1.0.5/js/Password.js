class Password{
	constructor(accountName, startX, startY){
		this.name = accountName
		this.startPoint = (startX, startY)
	}
}

function generateRandomString(length)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function generateMatrix(x, y){

	randomString = generateRandomString(x * y)
	randomMatrix = new Array(y)

	for (var i = 0; i < y; i++){
		randomMatrix[i] = new Array(x)
	}

	charCounter = 0

	for (var i = 0; i < randomMatrix.length; i++){
		for (var j = 0; j < randomMatrix[i].length; j++){
			randomMatrix[i][j] = randomString[charCounter++]
		}
	}

	return randomMatrix
}

function validatePlot(coordX, coordY, maxX, maxY){
	if(coordX > maxX){
		coordX = 0
	}else if(coordX < 0){
		coordX = maxX
	}

	if(coordY > maxY){
		coordY = 0
	}else if(coordY < 0){
		coordY = maxY
	}

	return {"x": coordX, "y":coordY} 

}

function plotPassword(startX, startY, sequence, matrix){
	currentPoint = {"x": startX, "y": startY}
	sequence = sequence.toLowerCase()
	plottedPassword = matrix[startX][startY]

	console.log(currentPoint)
	for(var i = 0; i < sequence.length; i++){
		direction = sequence[i]

		if(direction == "t"){
			currentPoint.y -= 1
		}else if(direction == "l"){
			currentPoint.x -= 1
		}else if(direction == "d"){
			currentPoint.y += 1
		}else if(direction == "r"){
			currentPoint.x += 1
		}else{
			console.log("you dun fukt up")
			throw "Value Error: Sequence contains a value other than TLDR"
		}
		// console.log(currentPoint)
		currentPoint = validatePlot(currentPoint.x, currentPoint.y, matrix[0].length - 1, matrix.length - 1)
		console.log(currentPoint)
		plottedPassword += matrix[currentPoint.y][currentPoint.x]

	}
	console.log(sequence)
	return plottedPassword
}


randomizedMatrix = generateMatrix(5, 5)

for (var i = 0; i < randomizedMatrix.length; i++){
	row = ""
	for (var j = 0; j < randomizedMatrix[i].length; j++){
		row += randomizedMatrix[i][j] + "  "
	}
	console.log(row)
}

console.log(plotPassword(0, 0, "LTRD", randomizedMatrix))
