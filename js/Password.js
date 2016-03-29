class Password {
    constructor(accountName, password, path, color) {
        this.name = accountName
        this.password = password
        this.path = path
        this.color = color
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

function validateSeq(sequence){
	sequence = sequence.toLowerCase()
	for(var i = 0 ; i < sequence.length; i++){
		if(sequence[i] == "u" || sequence[i] == "d" || sequence[i] == "l" || sequence[i] == "r"){
			return true
		}else{
			throw "Value Error: Sequence contains a value other than ULDR"
		}
	}
}

var colors = ['#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#f1c40f', '#e67e22', '#e74c3c', '#ecf0f1']

$(document).ready(function(e) {
    var sequence = ""
    var accounts = []
    var passwordList = []

    $.fn.extend({
        qcss: function(css) {
            return $(this).queue(function(next) {
                $(this).css(css);
                next();
            });
        }
    });

    $('#step1-next-button').click(function(e) {
        sequence = $('#sequence-input').val()
        try{
        	validateSeq(sequence)
        }catch(err){
        	console.log(err)
        	return
        }
        $("#step3-side-bar-container").empty()
        $("#password-matrix").empty()
        $("#text-sequence").empty()
    })

    $('#step2-next-button').click(function(e) {
        accounts = []
        $('.media-icon').each(function(e) {
            // console.log($(this))
            if ($(this).data('toggle') == "on")
                accounts.push($(this).data('media-type'))
        })

        $("#step3-side-bar-container").empty()
        $("#password-matrix").empty()
        $("#text-sequence").empty()
    })

    $('#step3-generate-button').click(function(e) {
        //get sequence
        sequence = $('#sequence-input').val()

        //generate matrix
        randomizedMatrix = generateMatrix(9, 9)

        //add matrix to dom
        var table = $("#password-matrix")
        table.empty()

        var header = "<tr><td class='matrix-index'><div class='content'>0</div></td>"
        for (var i = 1; i < randomizedMatrix.length + 1; i++) {
            header += "<td class='matrix-index'><div class='content'>" + i + "</div></td>"
        }
        header += "</tr>"

        table.append(header)


        for (var i = 0; i < randomizedMatrix.length; i++) {

            var row = "<tr>";
            row += "<td class='matrix-index'><div class='content'>" + (i + 1) + "</div></td>"
            for (var j = 0; j < randomizedMatrix[0].length; j++) {

                row += "<td id='password-matrix-" + i + "-" + j + "'><div class='content matrix-password-cell'>" + randomizedMatrix[i][j] + "</div></td>"
            }
            row += "</tr>"

            table.append(row)
        }

        //display sequence
        $('#text-sequence').text("Sequence: " + sequence.toUpperCase())
        document.getElementById('text-sequence').style.visibility = "visible"


        //add account list to side bar        
        $("#step3-side-bar-container").append("<div id='step3-side-bar'></div>")
        passwordList = []

        //plot the passwords
        $('#step3-side-bar').empty()

        for (var i = 0; i < accounts.length; i++) {
            var startX = Math.floor((Math.random() * randomizedMatrix.length))
            var startY = Math.floor((Math.random() * randomizedMatrix.length))
            var passwordDetails = plotPassword(startX, startY, sequence, randomizedMatrix).slice()


            $('#step3-side-bar').append("<div class='step3-side-bar-item' data-side-bar-item-index='" + i + "' style='background-color:" + colors[i] + ";'><div><h3>" + accounts[i] + "</h3></div><div>Start: (" + (startX + 1) + "," + (startY + 1) + ")</div><div><h4>PW: " + passwordDetails[1] + "</h4></div></div>")

            for (var j = 0; j < passwordDetails[0].length; j++) {
                $('#password-matrix-' + passwordDetails[0][j].y + '-' + passwordDetails[0][j].x).addClass("matrix-block-" + accounts[i])
                $('#password-matrix-' + passwordDetails[0][j].y + '-' + passwordDetails[0][j].x + ' div.content').css("background-color", colors[i])
            }

            passwordList.push(new Password(accounts[i], passwordDetails[1], passwordDetails[0], colors[i]))
        }
        $('#step3-side-bar').append("<div class='step3-side-bar-reset' style='background-color:grey;'><div><h3>Show All</h3></div></div>")
        $('#step3-side-bar').append("<div class='step3-side-bar-print' style='background-color:black;'><div><h3>Print</h3></div></div>")


        $('.step3-side-bar-reset').click(function(e) {

        	$('.matrix-password-cell').css('background-color', 'grey')

            for (var i = 0; i < passwordList.length; i++) {
            	for (var j = 0; j < passwordList[i].path.length; j++){
            		$('#password-matrix-' + passwordList[i].path[j].y + '-' + passwordList[i].path[j].x + ' div.content').css({ "background-color": passwordList[i].color })
            	}
            }
        })

        $('.step3-side-bar-print').click(function(e) {
        	$.print('#password-matrix')
        })

        $('.step3-side-bar-item').click(function(e) {

            $('.matrix-password-cell').css('background-color', 'grey')

            var i = $(this).data('side-bar-item-index')
            console.log(i)

            console.log(passwordList[i])

            // for (var j = 0; j < passwordList[i].path.length; j++) {

            //     $('#password-matrix-' + passwordList[i].path[j].y + '-' + passwordList[i].path[j].x + ' div.content').delay(750).qcss({"background-color": passwordList[i].color})
            // }
            var j = 0
            var loop = setInterval(function() {
                if (j == passwordList[i].path.length - 1) {
                    clearInterval(loop);
                }
                $('#password-matrix-' + passwordList[i].path[j].y + '-' + passwordList[i].path[j].x + ' div.content')
                    .delay(0)
                    .qcss({ "background-color": passwordList[i].color })
                    .delay(100)
                    .qcss({ "font-size": '3.5vw' })
                    .delay(100)
                    .qcss({ "font-size": '3.0vw' })

                j++
            }, 250)
        })
    })


})
