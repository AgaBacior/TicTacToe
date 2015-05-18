// variables global 
var context;
var nbCell = 0;
var sizeCase = 200;
var name1;
var name2;

var movePlayer;
var playerX;
var playCount;

$(function(){

	// event lauch when form is submited
	$('form').on('submit', function(e){
		e.preventDefault();
		
		// hidden the form with names
		// dislay the canvas with the game
		$('#registeredForm').addClass('hidden');		
		$('#game').removeClass('hidden');
		
		// take each player's name value 

		setName($('#name1').val(), $('#name2').val());

		// canvas
		var canvas = document.querySelector('canvas');

		context = canvas.getContext('2d');
		//context.fillRect(0, 0, 600, 600);
		
		initialization();		
		countNbCell();

		// event tigger each time whether canvas is clicked
		//canvas.addEventListener('click', managePlay);
		$(context.canvas).on('click', managePlay);

		// if btn quitGame is clicked
		$('#quitGame').on('click', function(){
			window.location = "index.html";
		});

		// if btn continue is cliked 
		$('#nextGame').on('click', nextGame);

		// if btn continue is cliked 
		$('#closeBox').on('click', function(){
			$('#alertBox').addClass('hidden');
		});

	});

	var setName = function (namePlayer1, namePlayer2) {

		//add names and img 'x' or 'o' to DOM
		$('div').html('<p>' + namePlayer1 + '<span class="xClass"></span></p><p>' + namePlayer2 + '<span class="oClass"></span></p>');

		name1 = namePlayer1;
		name2 = namePlayer2;
	};

	var countNbCell = function() {
		
		for (var i = 0, l = movePlayer.length; i<l; i++) {
			var movePlayerDim2 = movePlayer[i];
			
			for (var j = 0, l = movePlayerDim2.length; j<l; j++) {
				nbCell ++;
			}
		}
	}
	//
	var initialization = function () {
		
		movePlayer = [['e','e','e'],['e','e','e'],['e','e','e']];
		playerX = true;
		playCount = 0;

		// draw lines vertically and horizontally
		for(var x = 200.5; x<600; x+=200){
			context.moveTo(x, 0);
			context.lineTo(x, 600);			
		}

		for(var y = 200.5; y<600; y+=200){
			context.moveTo(0, y);
			context.lineTo(600, y);
		}

		context.strokeStyle ='#6E7171';
		context.stroke();
	}

	// 
	var managePlay = function(e){

		//get a position of click on the canvas 
		var positionX = e.pageX - this.offsetLeft;
		var positionY = e.pageY - this.offsetTop;

		// convert a position on the canvas on a position a cell in the array 
		var x = Math.floor(positionX/sizeCase);
		var y = Math.floor(positionY/sizeCase);

		var caseContent = movePlayer[x][y];
		
		// test: if this cell not clicked (item of array ==='e') put 'x' for playerX or 'o' if it's not playerX
		if (caseContent === 'e') {
			
			if (playerX) {
				caseContent = 'x';	
			} else {
				caseContent = 'o';
			}
			
			movePlayer[x][y] = caseContent;
			
			// add Image on the canvas
			addImgMove(x, y, playerX);

			// count valable clicks
			playCount++;
			
			// after 5 clicks check if someone wins 
			if (playCount > 4) {
				
				// test if someone wins true or false 
				var winner = testWinner();				
				
				if (winner) {
					endMsg(true, playerX);
				} else {
					
					// test if empty cells
					if (playCount === nbCell){
						endMsg(false);
					}
				}				
			}

			// switch the player who clicks
			playerX = !playerX;

		} else {
			$('#alertBox').removeClass('hidden');
		}
	}

	// add an image of 'x' or 'o ' depending on the player 
	var addImgMove = function(posX, posY, playerX){
		
		// calculete a position on the canvas, deponding on the size of image
		var posCaseX = (posX*sizeCase)+80;
		var posCaseY = (posY*sizeCase)+80;

		// create img, src deponding on player who played
		var playerImg = document.createElement('img');
		
		if (playerX){
			playerImg.src = 'img/x.png';
		} else {
			playerImg.src = 'img/o.png';
		}
		// add an image 
		context.drawImage(playerImg, posCaseX, posCaseY);
	}
	//
	var testWinner = function() {
			
		if (movePlayer[0][0] === movePlayer[1][1] && movePlayer[1][1] === movePlayer[2][2]){
			
			if (movePlayer[1][1] !== 'e'){
				return true;
			} 
		} 

		if (movePlayer[0][2] === movePlayer[1][1] && movePlayer[1][1] === movePlayer[2][0]){
			
			if (movePlayer[1][1] !== 'e'){
				return true;
			} 
		} 

		for (var i = 0, l = movePlayer.length; i<l; i++) {
					
			if (movePlayer[i][0] === movePlayer[i][1] && movePlayer[i][1] === movePlayer[i][2]){
				
				if (movePlayer[i][1] !== 'e'){
					return true;
				}
			}
			if (movePlayer[0][i] === movePlayer[1][i] && movePlayer[1][i] === movePlayer[2][i]){
				
				if (movePlayer[1][i] !== 'e'){
					return true;
				}
			}
		}
		
		return false;
	}
	var endMsg = function (winner) {
		
		if (winner) {
			$('#boxGameOver div').html('<p>Wygral'+ (playerX ? ' krzyzyk' : 'o kolko') + '</p>');
		} else {
			$('#boxGameOver div').html('<p>Remis' + '</p>');			
		}

		$('#boxGameOver').removeClass('hidden');

		//remove click on canvas
		$(context.canvas).off('click',managePlay);
	};

	var nextGame = function() {

		$('#boxGameOver').addClass('hidden');
		// initialization variable
		
		context.clearRect(0, 0, 600, 600);
		
		setName(name2, name1);
		initialization();

		$(context.canvas).on('click', managePlay);

	};
});
