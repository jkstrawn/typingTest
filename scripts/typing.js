var WORDS = {};


var dvorak = [];
dvorak[0] = 10;
dvorak[1] = 25;
dvorak[2] = 7;
dvorak[3] = 15;
dvorak[4] = 12;
dvorak[5] = 5;
dvorak[6] = 6;
dvorak[7] = 16;
dvorak[8] = 14;
dvorak[9] = 22;
dvorak[10] = 23;
dvorak[11] = 9;
dvorak[12] = 26;
dvorak[13] = 18;
dvorak[14] = 11;
dvorak[15] = 3;
dvorak[16] = 21;
dvorak[17] = 8;
dvorak[18] = 19;
dvorak[19] = 17;
dvorak[20] = 13;
dvorak[21] = 28;
dvorak[22] = 27;
dvorak[23] = 24;
dvorak[24] = 4;
dvorak[25] = 29;


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.lastTime = 0;
}

Timer.prototype.tick = function() {
    var currentTime = Date.now();
    var deltaTime = (currentTime - this.lastTime);
    this.lastTime = currentTime;

    return deltaTime;
}

function Key () {
	this.totalTime = 0;
	this.count = 0;
	this.letterTimings = [];
	this.averageTime = 0;
}

Key.prototype.setLetterTiming = function (time) {
	if (time > 400)
		return;
	this.count++;
	this.totalTime += time;
	this.averageTime = this.totalTime / this.count;
}

function LetterRank (score, finger, row) {
	this.score = score;
	this.finger = finger;
	this.row = row;

	this.digraph = [];
}

function Word () 
{
	this.word = "";
	this.difficulty = 0;
}

Word.prototype.setDifficulty = function (difficulty)
{
	this.difficulty = difficulty;
}

Word.prototype.getDifficulty = function ()
{
	return this.difficulty;
}

Word.prototype.setWord = function(word)
{
	this.word = word;
}

Word.prototype.toString = function()
{
	return this.word;
}

//*****************************************************************************************************************************************************************
//******************************************************************* CONTROLLER **********************************************************************************
//*****************************************************************************************************************************************************************
function Controller() {
	this.lettersTyped = [];
	this.mistakes = [];
	this.wordsTyped = [];

	this.letterStatList = [];

	this.wordObject;
	this.nextWord;

	this.session = new UserSession();
	this.allPossibleWords = [];
	this.completedWords = [];
	this.wordObjects = [];
	this.activeWordObject = null;
	this.wordsLeft = 0;
	this.timer = new Timer();
	this.layout = "dvorak";

	this.consecutiveLetters = 0;
	this.difficultyLevel = 0;
	this.score = 0;
}

Controller.prototype.init = function(wordList) {

	for (var i = 0; i < 26; i++) {
		this.letterStatList[i] = new Key();
	}

	displayWord('treat');
	displayWord('against');
	displayWord('break');
	displayWord('pasta');
	displayWord('cope');
	displayWord('jaw');

	//var uniqueWordList = $.unique(wordList.match(/\w+/mg));


	//this.setallPossibleWords(uniqueWordList);
	//this.setallPossibleWords(["play", "dance", "wolf", "walk", "sleep", "talk"]);
	this.setallPossibleWords(wordList);
	this.wordsLeft = this.allPossibleWords.length;

	this.makeNewWordObject();
	//this.getNewWord();
	this.displayLetterTime();
}

//Initiate the list of all words that can be used
Controller.prototype.setallPossibleWords = function(wordsList) {
	var that = this;
	$.each(wordsList, function (index, element) {
		var word = new Word();

		word.setWord(element);
		word.setDifficulty(that.getWordScore(element));

		that.allPossibleWords.push(word);
	});
}

Controller.prototype.makeNewWordObject = function() {
	var word = this.getAnUnusedWord();
	this.putWordOntoPage(word);
}

Controller.prototype.getAnUnusedWord = function() {
	if (this.wordsLeft == 0) {
		this.wordsLeft = this.allPossibleWords.length;
	}
	var index = Math.floor(Math.random() * this.wordsLeft);
	var word = this.allPossibleWords[index];
	console.log("chose " + index + " out of " + this.wordsLeft + " : " + word);
	this.moveWordToEndOfWordList(index);
	this.wordsLeft--;

	return word;
}

Controller.prototype.moveWordToEndOfWordList = function(index) {
	//var word = this.allPossibleWords.splice(index, 1);
	var word = this.allPossibleWords[index];
	this.allPossibleWords.splice(index, 1);
	this.allPossibleWords.push(word);
}

Controller.prototype.setNextWord = function(word) {
	this.nextWord = word;
	$("#nextWord").html(word.toString());
}

/*
//Grab a new word from the list of total words and set it as the next word to use
Controller.prototype.getNewWord = function() {
	var _nextWord = this.getUnusedWord();

	var wordToUse = this.nextWord;

	this.setNextWord(_nextWord);

	//The first time there will not be a word in the next div, so give a new random one
	if (wordToUse == undefined) {
		wordToUse = this.getUnusedWord();
	}

	this.setWord(wordToUse);
	this.session.addWord(wordToUse);
}

Controller.prototype.setNextWord = function(word) {
	this.nextWord = word;
	$("#nextWord").html(word.toString());
}

//Get a word that has not been used yet from the word object list
Controller.prototype.getUnusedWord = function() {
	var randomInt = Math.floor(Math.random() * this.allPossibleWords.length);
	var unusedWord = this.allPossibleWords[randomInt];

	var isWordUsed = this.session.checkWordUsed(unusedWord);

	//Only try to find an unused word if there are any left
	if(this.session.getWordUsedLength < this.allPossibleWords.length) {
		while (isWordUsed) {
			//get a new word if the word is used
			randomInt = Math.floor(Math.random() * this.allPossibleWords.length);
			unusedWord = this.allPossibleWords[randomInt];
			isWordUsed = this.session.checkWordUsed(unusedWord);
		}
	}

	return unusedWord;
}
*/
//Set the word onto page for the user to type
Controller.prototype.putWordOntoPage = function(word) {
	this.createWordObjects();

	var score = word.getDifficulty();
	var wordScoreDiv = $('#wordScoreDiv');	
	//Set the score of the word onto the score div
	wordScoreDiv.html(Number((score).toFixed(3)));
};

Controller.prototype.createWordObjects = function() {

	for (var i = 0; i < 3; i++) {
		var word = this.getAnUnusedWord();
		var wordObject = new WORDS.WordObject("id", word, 400, 200 + i * 100, this, this.recordLetter, this.addCompletedWord, this.addMissedLetter);
		wordObject.init();
		this.wordObjects.push(wordObject);
	}
};

//Update the timings on the page for the individual letters typed
Controller.prototype.displayLetterTime = function() {
	var letterScoresDiv = $('#letterScores');
	var html = "<table>";
	for (var i = 0; i < 26; i++) {
		html += "<tr><td>" + String.fromCharCode(i+97) + "</td><td>" + this.letterStatList[i].averageTime + "ms</td></tr>";
	}
	html += "</table>";
	letterScoresDiv.html(html);
};

//Record a key that was typed, and add the timing to the letter list
Controller.prototype.recordLetter = function(letter, previous, time) {
	var index = letter.charCodeAt(0)-97;
	console.log(this);
	this.letterStatList[index].setLetterTiming(time);
	this.displayLetterTime();
}

Controller.prototype.getWordScore = function(word) {
	var letters = [];
	var previousFinger = -1;
	var previousRow = 0;
	var previousLetter = -1;
	var previousHand = 0;
	var sum = 0;
	var handDuration = 1;

	for (var i = 0; i < word.length; i++) {
		var letter = word[i];
		var letterCode = letter.charCodeAt(0)-97;
		var score = keyboardList[this.convert(letterCode)].score;
		var row = keyboardList[this.convert(letterCode)].row;
		var finger = keyboardList[this.convert(letterCode)].finger;
		var hand = (finger < 5) ? 1 : 2;

		//add word length difficulty modifier
		score += .07*i;

		if (previousHand == hand) {
			if (previousLetter >= 0) {
				//add digraph difficulty
				score += keyboardList[this.convert(letterCode)].digraph[this.convert(previousLetter)];
			}

			//harder the longer its on the same hand
			handDuration++;
			score += handDuration*handDuration*.1; 
		} else {
			handDuration = 1;
			//add default difficulty
			score += 0.9;
		}

		letters[i] = score;
		sum += score;

		previousFinger = finger;
		previousLetter = letterCode;
		previousRow = row;
		previousHand = hand;
	}

	var finalScore = sum / letters.length;

	for (var i = 0; i < 26; i++) {
		//for each letter check its frequency
		var count = 0;

		for (var k = 0; k < word.length; k++) {
			if ((word.charCodeAt(k)-97) == i) {
				count++;
			}
		}


		if (count > 2) {
			//the more occurances there are of the same letter, add more difficulty
			finalScore += .2 * count;
		}
	}

	return finalScore;
}

Controller.prototype.receiveKey = function(key) {
	var typedLetter = String.fromCharCode(key);
	var clockTick = this.timer.tick();

	if (this.activeWordObject == null) {
		var wordObject = this.findWordObjectByFirstLetter(typedLetter);
		if (wordObject) {
			this.activeWordObject = wordObject;
		} else {
			return;
		}		
	}

	this.activeWordObject.receiveKey(typedLetter, clockTick);

	$("#stats").html(this.session.toString());
};

Controller.prototype.findWordObjectByFirstLetter = function(letter) {
	for (var i = this.wordObjects.length - 1; i >= 0; i--) {
		var wordObject = this.wordObjects[i];
		var firstLetter = wordObject.getFirstLetter();
		if (firstLetter == letter) {
			return wordObject;
		}
	};

	return false;
};

Controller.prototype.convert = function(index) {
	if (this.layout == "dvorak") {
		return dvorak[index];
	} else {
		//its qwerty
		return index;
	}
};

Controller.prototype.addCompletedWord = function(word) {
	var index = this.wordObjects.indexOf(this.activeWordObject);
	this.wordObjects.splice(index, 1);
	this.activeWordObject = null;

	this.completedWords.push(word);

	this.makeNewWordObject();
};

Controller.prototype.addConsecutiveLetter = function() {
	this.consecutiveLetters++;
}

Controller.prototype.addMissedLetter = function() {
	this.consecutiveLetters = 0;
}

//********************************************************************************************************************************************************
//*********																WordObject 																**********
//********************************************************************************************************************************************************


	var WordObject = my.Class({

		STATIC: {
		  	AGE_OF_MAJORITY: 18
		},

		constructor: function(id, word, x, y, caller, recordLetter, completedWord, missedLetter) {
			this.id = id;
			this.word = word;
			this.x = x;
			this.y = y;
			this.position = 0;
			this.currentLetter = "-";
			this.letters = [];
			this.div = null;
			callbacks = {};
			callbacks.caller = caller;
			callbacks.recordLetter = recordLetter;
			callbacks.completedWord = completedWord;
			callbacks.missedLetter = missedLetter;
		},

		init: function() {
			var div = document.createElement('div');
			div.id = "wordDiv";
			div.style.top = this.y + "px";
			div.style.left = this.x + "px";
			var wordHtml = "";

			//create the individual letter spans (so they can be colored as they are typed)
			for (var i = 0; i < this.word.toString().length; i++) {
				wordHtml += '<span id="letter' + i + '">' + this.word.toString()[i] + '</span>';
			};

			this.div = $(div);
			this.div.html(wordHtml);
			document.body.appendChild(div);
		},

		removeDiv: function() {
			this.div.remove();
		},

		advancePosition: function() {
			this.position++;

			if (this.position >= this.word.toString().length) {
			//finished typing the word
				this.removeDiv();
				callbacks.completedWord.call(callbacks.caller, this.word);
			}
		},

		receiveKey: function(typedLetter, dt) {
			var nextLetter = this.word.toString()[this.position];

			if (typedLetter == nextLetter) {
				callbacks.recordLetter.call(callbacks.caller, typedLetter, this.currentLetter, dt);
				//var _letter = new Letter(typedLetter, dt, currentLetter, position);
				//lettersTyped.push(_letter);

				var letterDiv = this.div.children('#letter'+this.position);
				letterDiv.css("color", "red");
				this.currentLetter = nextLetter;
				this.advancePosition();
			} else {
				//var _mistake = new Mistake(nextLetter, currentLetter, dt, typedLetter);
				//mistakes.push(_mistake);
				callbacks.missedLetter.call(callbacks.caller);
			}

		},

		getFirstLetter: function() {
			return this.word.word[0];
		},

		update: function() {},

	});

	console.log("testing it");

	WORDS.WordObject = WordObject;


//********************************************************************** PAGE LOADED *********************************************************************

var mode = "classic";
var rpgManager = new RpgManager();
var controller = new Controller();

$(document).ready( function() {
	if (mode == "classic") {
		$(document).keypress(function(event) { return sendKeyStroke(event) });
		$(document).keydown(function(event) { return cancelBackspace(event) });
		controller.init(wordList);
		setMode(mode);
	} else if (mode == "rpg") {
		rpgManager = new RpgManager();
		rpgManager.initialize();
		$(document).keypress(function(event) { return rpgManager.sendKey(event) });
		$(document).keydown(function(event) { return rpgManager.sendKeyDown(event) });
		$(document).keyup(function(event) { return rpgManager.sendKeyUp(event) });
		$(document).mouseup(function(event) {
			rpgManager.sendMouseUp(event);
		});
	}

	// When clicking on the button close or the mask layer the popup closed
	$('a.close, #mask').live('click', function() { 
		$('#mask , .keyboard-popup').fadeOut(300 , function() {
			$('#mask').remove();  
		}); 
		return false;
	});
});

function displayWord (word) {
	console.log("Word score of " + word + " = " + controller.getWordScore(word));
}

function setMode (newMode) {
	mode = newMode;
	if (mode == 'rpg') {
		rpgManager.initialize();
	}
}

function sendKeyStroke (event) {
	//console.log("key: " + event.keyCode);
	controller.receiveKey(event.keyCode);
	return false;
}

function cancelBackspace (event) {
	//console.log("key: " + event.keyCode);
	if (event.keyCode == 8 || event.keyCode == 9) {
		controller.receiveKey(event.keyCode);
		return false;
	}
}

function chooseKeyboard(layout) {
	controller.keyboardLayout = layout;

	$('#mask , .keyboard-popup').fadeOut(300 , function() {
		$('#mask').remove();  
	});
}

function openKeyboardLayout() {
	// Getting the variable's value from a link 
	var keyboardBox = "#keyboard-box";

	// Fade in the Popup
	$(keyboardBox).fadeIn(300);

	// Set the center alignment padding + border see css style
	var popMargTop = ($(keyboardBox).height() + 24) / 2; 
	var popMargLeft = ($(keyboardBox).width() + 24) / 2; 

	$(keyboardBox).css({ 
		'margin-top' : -popMargTop,
		'margin-left' : -popMargLeft
	});

	// Add the mask to body
	$('body').append('<div id="mask"></div>');
	$('#mask').fadeIn(300);

	return false;
}