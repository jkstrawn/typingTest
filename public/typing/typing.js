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
	this.text = "";
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

Word.prototype.setWord = function(text)
{
	this.text = text;
}

Word.prototype.toString = function()
{
	return this.text;
}

//*****************************************************************************************************************************************************************
//******************************************************************* CONTROLLER **********************************************************************************
//*****************************************************************************************************************************************************************
function Controller() {
	this.lettersTyped = [];
	this.mistakes = [];
	this.wordsTyped = [];
	this.nextWords = [];

	this.letterStatList = [];

	this.wordHtmlObject;
	this.nextWord;

	this.session = new UserSession();
	this.allPossibleWords = [];
	this.completedWords = [];
	this.columns = [];
	this.activeColumn = null;
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

	this.setallPossibleWords(wordList);
	this.wordsLeft = this.allPossibleWords.length;

	this.columns.push(new WORDS.WordColumn("ability1", 100, 100, "ability1"));
	this.columns.push(new WORDS.WordColumn("ability2", 200, 200, "ability2"));
	this.columns.push(new WORDS.WordColumn("ability3", 300, 300, "ability3"));
	this.columns.push(new WORDS.WordColumn("ability4", 400, 400, "ability4"));

	for (var i = this.columns.length - 1; i >= 0; i--) {
		this.columns[i].init();
	};
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

Controller.prototype.getFirstLetters = function() {
	var firstLetters = "";

	for (var i = this.columns.length - 1; i >= 0; i--) {
		var letters = this.columns[i].getFirstLetters();
		firstLetters += letters;
	};

	return firstLetters;
};

Controller.prototype.getAnUnusedWord = function() {
	if (this.wordsLeft == 0) {
		this.wordsLeft = this.allPossibleWords.length;
	}
	var letters = this.getFirstLetters();

	var shortCircuit = 1000;
	for (var i = 0; i < shortCircuit; i++) {
		var index = Math.floor(Math.random() * this.wordsLeft);
		var word = this.allPossibleWords[index];
		if (letters.indexOf(word.text[0]) == -1) {
			console.log("chose " + index + " out of " + this.wordsLeft + " : " + word + " after " + (i+1) + " tries");
			this.moveWordToEndOfWordList(index);
			this.wordsLeft--;

			return word;
		}
	}

	console.log("searched 1000 words but found no appropriate word");
	return null;
}

Controller.prototype.moveWordToEndOfWordList = function(index) {
	//var word = this.allPossibleWords.splice(index, 1);
	var word = this.allPossibleWords[index];
	this.allPossibleWords.splice(index, 1);
	this.allPossibleWords.push(word);
}

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
	this.letterStatList[index].setLetterTiming(time);
	// this.displayLetterTime();
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

	if (this.activeColumn == null) {
		var column = this.findColumnWithStartingLetter(typedLetter);
		if (column) {
			this.activeColumn = column;
		} else {
			return;
		}		
	}

	this.activeColumn.receiveKey(typedLetter, clockTick);

	$("#stats").html(this.session.toString());
};

Controller.prototype.findColumnWithStartingLetter = function(letter) {

	for (var i = this.columns.length - 1; i >= 0; i--) {
		var firstLetter = this.columns[i].getFirstLetter();
		if (firstLetter == letter) {
			return this.columns[i];
		}
	};

	return false;
};

Controller.prototype.getWordHtmlObjects = function() {
	var wordObjects = [];

	for (var i = this.columns.length - 1; i >= 0; i--) {
		wordObjects.push(this.columns[i].currentWordObject);
	};

	return wordObjects;
};

Controller.prototype.convert = function(index) {
	if (this.layout == "dvorak") {
		return dvorak[index];
	}
	//its qwerty
	return index;
};

Controller.prototype.addCompletedWord = function(word) {
	var command = this.activeColumn.command;

	this.activeColumn.getNextWord();
	this.activeColumn = null;
	this.completedWords.push(word);

	type.player.doCommand(command);
};

Controller.prototype.addConsecutiveLetter = function() {
	this.consecutiveLetters++;
}

Controller.prototype.addMissedLetter = function() {
	this.consecutiveLetters = 0;
}

//********************************************************************************************************************************************************
//*********																WordHtmlObject 																**********
//********************************************************************************************************************************************************


var WordHtmlObject = my.Class({

	STATIC: {
	  	AGE_OF_MAJORITY: 18
	},

	constructor: function(id, word) {
		this.id = id;
		this.word = word;
		this.position = 0;
		this.currentLetter = "-";
		this.letters = [];
		this.div = null;
	},

	createHtml: function() {
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		var div = document.createElement('div');
		// div.id = "wordDiv";
		var wordHtml = "";

		//create the individual letter spans (so they can be colored as they are typed)
		for (var i = 0; i < this.word.toString().length; i++) {
			wordHtml += '<span id="letter' + i + '">' + this.word.toString()[i] + '</span>';
		};

		div.innerHTML = wordHtml;

		td.appendChild(div);
		tr.appendChild(td);

		this.tr = $(tr);
		this.div = $(div);

		return tr;
	},

	removeDiv: function() {
		this.tr.remove();
	},

	advancePosition: function() {
		this.position++;

		if (this.position >= this.word.toString().length) {
		//finished typing the word
			this.removeDiv();
			controller.addCompletedWord(this.word);
		}
	},

	receiveKey: function(typedLetter, dt) {
		var nextLetter = this.word.toString()[this.position];

		if (typedLetter == nextLetter) {
			controller.recordLetter(typedLetter, this.currentLetter, dt);
			//var _letter = new Letter(typedLetter, dt, currentLetter, position);
			//lettersTyped.push(_letter);

			var letterDiv = this.div.children('#letter'+this.position);
			letterDiv.css("color", "red");
			this.currentLetter = nextLetter;
			this.advancePosition();
		} else {
			//var _mistake = new Mistake(nextLetter, currentLetter, dt, typedLetter);
			//mistakes.push(_mistake);
			controller.addMissedLetter();
		}

	},

	getFirstLetter: function() {
		return this.word.text[0];
	},

	setAsCurrent: function() {
		this.tr.addClass("current");
	},

	update: function() {},

});

console.log("testing it");

WORDS.WordHtmlObject = WordHtmlObject;


//********************************************************************** WORD COLUMN *********************************************************************

var WordColumn = my.Class({

	constructor: function(id, x, y, command) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.command = command;
		this.div = null;
		this.wordObjects = [];
		this.currentWordObject = null;
	},

	init: function() {
		this.div = document.getElementById(this.id);

		for (var i = 0; i < 3; i++) {
			this.addNewWord();
		}

		this.currentWordObject = this.wordObjects.shift();
		this.currentWordObject.setAsCurrent();
	},

	addNewWord: function() {
		var table = this.div.children[0];
		var newWord = controller.getAnUnusedWord();
		var newWordObject = new WORDS.WordHtmlObject("1", newWord);
		var wordRow = newWordObject.createHtml();

		this.wordObjects.push(newWordObject);
		table.appendChild(wordRow);
	},

	getNextWord: function() {
		this.currentWordObject.removeDiv();
		this.currentWordObject = this.wordObjects.shift();
		this.currentWordObject.setAsCurrent();
		this.addNewWord();
	},

	getFirstLetters: function() {
		var firstLetters = "";

		for (var i = this.wordObjects.length - 1; i >= 0; i--) {
			firstLetters += this.wordObjects[i].getFirstLetter();
		};

		if (this.currentWordObject)
			firstLetters += this.currentWordObject.getFirstLetter();

		return firstLetters;
	},

	getFirstLetter: function() {
		return this.currentWordObject.getFirstLetter();
	},

	receiveKey: function(key, dt) {
		this.currentWordObject.receiveKey(key, dt);
	},

});

WORDS.WordColumn = WordColumn;
//********************************************************************** PAGE LOADED *********************************************************************

var mode = "classic";
var controller = new Controller();

$(document).ready( function() {
	$(document).keypress(function(event) { return sendKeyStroke(event) });
	$(document).keydown(function(event) { return cancelBackspace(event) });
	controller.init(wordList);

});

function displayWord (word) {
	console.log("Word score of " + word + " = " + controller.getWordScore(word));
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