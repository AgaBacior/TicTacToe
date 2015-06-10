$(function(){
	
	// Variables  
	var context;
	var nbCell = 0;
	var sizeCase = 200;
	var name1;
	var name2;

	var movePlayer;
	var playerX;
	var playCount;

	var nbImageLoaded = 0;
	var imageX;
	var imageO;	

	// When form is submitted event are launched
	$('form').on('submit', function(e){
		e.preventDefault();

		// This is the callback we will call when the X and O image will be loaded		
		var checkImageLoadShowCanvas = function() {
			// One image is loaded
			++nbImageLoaded;
						
			if (nbImageLoaded == 2) {
				// Both images are loaded we can show the canvas	
				$('#game').removeClass('hidden');
			}
		};
		
		// We create two image, X and O for drawing on the canvas
		// When both will be loaded the canvas will be showed		
		imageX = document.createElement('img');
		imageX.src = 'img/x.png';
		imageX.onload = checkImageLoadShowCanvas;
		
		imageO = document.createElement('img');
		imageO.src = 'img/o.png';
		imageO.onload = checkImageLoadShowCanvas;
		
		// Hidden the form with names
		$('#registeredForm').addClass('hidden');		

		// Add class smallTitle to change a size of the title
		$('h1').addClass('smallTitle');		
		
		// Take each player's name value 
		setName($('#name1').val(), $('#name2').val());

		// Take canvas
		var canvas = document.querySelector('canvas');

		context = canvas.getContext('2d');
		//context.fillRect(0, 0, 600, 600);
		
		// Launch two function initialization and countNbCell
		initialization();		
		countNbCell();

		// Event tigger each time whether canvas is clicked
		//canvas.addEventListener('click', managePlay);
		$(context.canvas).on('click', managePlay);

		// When the btn quitGame is clicked quit the game
		$('#quitGame').on('click', function(){
			window.location = "index.html";
		});

		// When the btn nextGame is clicked start a new game
		$('#nextGame').on('click', nextGame);

		// When the btn closeBox is clicked hide the alert box 
		$('#closeBox').on('click', function(){
			$('#alertBox').addClass('hidden');
		});

	});
	
	// Function - take each player's name value 
	var setName = function (namePlayer1, namePlayer2) {

		// Add names and a tag img 'x' or 'o' to DOM
		$('div').html('<p>' + namePlayer1 + '<span class="xClass"></span></p><p>' + namePlayer2 + '<span class="oClass"></span></p>');

		name1 = namePlayer1;
		name2 = namePlayer2;
	};

	// Count all cells of the array movePlayer
	var countNbCell = function() {
		
		for (var i = 0, l1 = movePlayer.length; i<l1; i++) {
			var movePlayerDim2 = movePlayer[i];
			
			for (var j = 0, l2 = movePlayerDim2.length; j<l2; j++) {
				nbCell ++;
			}
		}
	};
	
	// Initialize an empty arrays and the variables at the beginning of each game 
	var initialization = function () {
		
		// The empty arrays
		movePlayer = [['e','e','e'],['e','e','e'],['e','e','e']];
		
		// playerX starts the game		
		playerX = true;
		
		// playCount - no one has played
		playCount = 0;

		// Canvas - draw lines vertically and horizontally 
		for(var x = 200.5; x<600; x+=200){
			context.moveTo(x, 0);
			context.lineTo(x, 600);			
		}

		for(var y = 200.5; y<600; y+=200){
			context.moveTo(0, y);
			context.lineTo(600, y);
		}

		context.strokeStyle ='#818181';
		context.stroke();
	};

	// This is the function which manage the game 
	var managePlay = function(e){

		// Get a position of click on the canvas 
		var positionX = e.pageX - this.offsetLeft;
		var positionY = e.pageY - this.offsetTop;

		// Convert a position on the canvas on a position a cell in the array 
		var x = Math.floor(positionX/sizeCase);
		var y = Math.floor(positionY/sizeCase);

		var caseContent = movePlayer[x][y];
		
		// Test: if this cell not clicked (item of array ==='e') put 'x' for playerX or 'o' if it's not playerX
		if (caseContent === 'e') {
			
			if (playerX) {
				caseContent = 'x';	
			} else {
				caseContent = 'o';
			}
			
			movePlayer[x][y] = caseContent;
			
			// Add image on the canvas
			addImgMove(x, y, playerX);

			// Count valable clicks
			playCount++;
			
			// After 5 clicks check if someone wins 
			if (playCount > 4) {
				
				// Test: if someone wins true or false 
				var winner = testWinner();				
				
				if (winner) {
					endMsg(true, playerX);
				} else {
					
					// Test: if there is still empty cell
					if (playCount === nbCell){
						endMsg(false);
					}
				}				
			}

			// Switch the player who clicks
			playerX = !playerX;

		} else {

			// If this cell is clicked dispay alertBox
			$('#alertBox').removeClass('hidden');
		}
	};

	// Add an image of 'x' or 'o ' depending on the player 
	var addImgMove = function(posX, posY, playerX){
		
		// calculete a position on the canvas, deponding on the size of image
		var posCaseX = (posX*sizeCase)+80;
		var posCaseY = (posY*sizeCase)+80;
		
		// Add an image 'x' or 'o '
		if (playerX){
			context.drawImage(imageX, posCaseX, posCaseY);
		} else {
			context.drawImage(imageO, posCaseX, posCaseY);
		}
	};
	
	// Test if someone won. Compare the contents of array cells
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
	};

	// If someone won
	var endMsg = function (winner) {
		
		// Dislay the message depending on the result
		if (winner) {
			$('#boxGameOver div').html('<p>Wygrał gracz: '+ (playerX ? name1 : name2) + '</p>');
		} else {
			$('#boxGameOver div').html('<p>Nikt nie wygrał</p>');			
		}

		$('#boxGameOver').removeClass('hidden');

		// Remove click on canvas
		$(context.canvas).off('click',managePlay);
	};

	// Start a new game
	var nextGame = function() {

		// Hide the box Game Over
		$('#boxGameOver').addClass('hidden');
		
		// Clear the canvas
		context.clearRect(0, 0, 600, 600);

		// Switch players		
		setName(name2, name1);

		// Initialize the array and variables				
		initialization();
		
		// Start a new game				
		$(context.canvas).on('click', managePlay);

	};
});