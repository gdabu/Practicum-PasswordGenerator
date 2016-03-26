class Password {
    constructor(accountName, path) {
        this.name = accountName
        this.path = path
    }
}

function generateRandomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function generateMatrix(x, y) {

    randomString = generateRandomString(x * y)
    randomMatrix = new Array(y)

    for (var i = 0; i < y; i++) {
        randomMatrix[i] = new Array(x)
    }

    charCounter = 0

    for (var i = 0; i < randomMatrix.length; i++) {
        for (var j = 0; j < randomMatrix[i].length; j++) {
            randomMatrix[i][j] = randomString[charCounter++]
        }
    }

    return randomMatrix
}

function validatePlot(coordX, coordY, maxX, maxY) {
    if (coordX > maxX) {
        coordX = 0
    } else if (coordX < 0) {
        coordX = maxX
    }

    if (coordY > maxY) {
        coordY = 0
    } else if (coordY < 0) {
        coordY = maxY
    }

    return { "x": coordX, "y": coordY }

}

function plotPassword(startX, startY, sequence, matrix) {
    currentPoint = { "x": startX, "y": startY }
    sequence = sequence.toLowerCase()
    plottedPassword = matrix[startY][startX]

    sequenceCoords = []
    sequenceCoords.push({ "x": startX, "y": startY })

    console.log(currentPoint)
    for (var i = 0; i < sequence.length; i++) {
        direction = sequence[i]

        if (direction == "u") {
            currentPoint.y -= 1
        } else if (direction == "l") {
            currentPoint.x -= 1
        } else if (direction == "d") {
            currentPoint.y += 1
        } else if (direction == "r") {
            currentPoint.x += 1
        } else {
            throw "Value Error: Sequence contains a value other than ULDR"
        }

        currentPoint = validatePlot(currentPoint.x, currentPoint.y, matrix[0].length - 1, matrix.length - 1)
        sequenceCoords.push({ "x": currentPoint.x, "y": currentPoint.y })
        plottedPassword += matrix[currentPoint.y][currentPoint.x]

    }

    return [sequenceCoords, plottedPassword]
}

var colors=['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1']

$(document).ready(function(e) {
    var sequence = ""
    var accounts = []

    $('#step1-next-button').click(function(e) {
        sequence = $('#sequence-input').val()
    })

    $('#step2-next-button').click(function(e) {
    	accounts = []
        $('.media-icon').each(function(e) {
            // console.log($(this))
            if ($(this).data('toggle') == "on")
                accounts.push($(this).data('media-type'))
        })
        console.log(accounts)
    })

    $('#step3-generate-button').click(function(e) {
    	//get sequence
    	sequence = $('#sequence-input').val()

        //generate matrix
        randomizedMatrix = generateMatrix(6, 6)
        
        //add matrix to dom
        var table = $("#password-matrix")
        table.empty()

        for (var i = 0; i < randomizedMatrix.length; i++) {

        	
            var row = "<tr>";
            for (var j = 0; j < randomizedMatrix[0].length; j++) {
                row += "<td id='password-matrix-" + i + "-" + j + "'><div class='content'>" + randomizedMatrix[i][j] + "</div></td>"
            }
            row += "</tr>"
            console.log(row)
            table.append(row)
        }

        //display sequence
        $('#text-sequence').text("Sequence: " + sequence)
        document.getElementById('text-sequence').style.visibility="visible"


		//add account list to side bar        
        document.getElementById('step3-side-bar').style.visibility="visible"
        passwordList = []

        //plot the passwords
        $('#step3-side-bar').empty()
        for (var i = 0; i < accounts.length; i++) {
        	var startX = Math.floor((Math.random() * randomizedMatrix.length))
        	var startY = Math.floor((Math.random() * randomizedMatrix.length))
        	var password = plotPassword(startX, startY, sequence, randomizedMatrix).slice()
        	$('#step3-side-bar').append("<div style='background-color:" + colors[i] + ";'><div><h3>"+ accounts[i] +"</h3></div><div>Start: (" + startX + "," + startY + ")</div><div><h4>Password: " + password[1] + "</h4></div></div>")   
        	      		
      		for(var j = 0; j < password[0].length; j++){
      			$('#password-matrix-' + password[0][j].y + '-' + password[0][j].x).addClass("matrix-block-" + accounts[i])
      			$('#password-matrix-' + password[0][j].y + '-' + password[0][j].x + ' div.content' ).css("background-color", colors[i])
      		}
        }

        console.log(passwordList)


    })
})
