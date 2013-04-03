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
var timer = new Timer();

/*
function Mistake (letter, previous, time, typedLetter) {
	this.current = letter;
	this.previous = letter;
	this.time = time;
	this.typedLetter = typedLetter;
}

function Letter (letter, time, previous, position) {
	this.current = letter;
	this.time = time;
	this.previous = previous;
	this.position = position;
}

function Word (word, timeBefore, time) {
	this.current = word;
	this.timeBefore = timeBefore;
	this.time = time;
}
*/
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
	this.content = "";
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

Word.prototype.setContent = function(word)
{
	this.content = word;
}

Word.prototype.toString = function()
{
	return this.content;
}


var lettersTyped = [];
var wordsType = [];
var mistakes = [];

var letterList = [];
for (var i = 0; i < 26; i++) {
	letterList[i] = new Key();
}

var globalWord;
var globalNextWord;
var currentPosition = 0;
var letterStreak = 0;
var lastLetter = ' ';
var firstLetter = true;

var thisSession = new UserSession();
var wordObjectList = [];

var mode = "rpg";
var rpgManager;

function setWordObjectList(wordsList)
{
	$.each(wordsList, function (index, element) {
		var currWord = new Word();

		currWord.setContent(element);
		currWord.setDifficulty(getWordScore(element));

		wordObjectList.push(currWord);
	});
}


$(document).ready( function() {
	if (mode == "classic") {
		$(document).keypress(function(event) { return sendKeyStroke(event) });
		$(document).keydown(function(event) { return cancelBackspace(event) });
		initializeClassic();
	} else if (mode == "rpg") {
		rpgManager = new RpgManager();
		rpgManager.initialize();
		$(document).keypress(function(event) { return rpgManager.sendKey(event) });
	}
	
//	$(document).keyup(function(event) { return false });
});

function displayWord (word) {
	console.log("Word score of " + word + " = " + getWordScore(word));
}

function displayLetterTime () {
	var letterScoresDiv = $('#letterScores');
	var html = "<table>";
	for (var i = 0; i < 26; i++) {
		html += "<tr><td>" + String.fromCharCode(i+97) + "</td><td>" + letterList[i].averageTime + "ms</td></tr>";
	}
	html += "</table>";
	letterScoresDiv.html(html);
}

function recordLetter (letter, previous, time) {
	var index = letter.charCodeAt(0)-97;
	letterList[index].setLetterTiming(time);
	displayLetterTime();
}

function advancePosition () {
	currentPosition++;
	thisSession.addStreak();

	if (currentPosition >= globalWord.toString().length) {
		thisSession.addScore(globalWord.getDifficulty());
		getNewWord();
	}
}

function getWordScore (word) {
	var letters = [];
	var previousFinger = -1;
	var previousRow = 0;
	var previousLetter = -1;
	var previousHand = 0;
	var sum = 0;
	var handDuration = 1;

	for (var i = 0; i < 26; i++) {
		//for each letter
		
	}
	for (var i = 0; i < word.length; i++) {

	}

	for (var i = 0; i < word.length; i++) {
		var letter = word[i];
		var letterCode = letter.charCodeAt(0)-97;
		var score = dvorakLetterList[letterCode].score;
		var row = dvorakLetterList[letterCode].row;
		var finger = dvorakLetterList[letterCode].finger;
		var hand = (finger < 5) ? 1 : 2;

		//add word length difficulty modifier
		score += .07*i;
		if (previousLetter == letter) {
			//add same letter difficulty
			score *= 1.3;
		} else if (previousFinger == finger) {
			//add same finger difficulty
			score *= 1.7;
		} else if (Math.abs(previousFinger - finger) == 1 && row != 2) {
			//add same hand difficulty if its off the home row and fingers are next to each other
			score *= 1.3;
		}
		if (previousHand == hand) {
			//harder the longer its on the same hand
			handDuration++;
			score += handDuration*handDuration*.2; 
		} else {
			handDuration = 1;
		}
		if (previousFinger == finger+1 && row == 2) {
			//add consecutive home row difficulty
			score += .6;
		} else if (previousFinger == finger-1 && row == 2) {
			//add natural consecutive home row easiness
			score -= .3;
		}
		if (i == 0 && row != 2) {
			//if the word starts off the home row
			score *= 1.15;
		}

		letters[i] = score;
		sum += score;

		previousFinger = finger;
		previousLetter = letter;
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


		if (count > 1) {
			//the more occurances there are of the same letter, add more difficulty
			finalScore += .1 * count;
		}
	}

	return finalScore;
}

function getNewWord () {
	var nextWord = getUnusedWord();

	var word = getNextWord();

	setNextWord(nextWord);

	//The first time there will not be a word in the next div, so give a new random one
	if (word == undefined)
	{
		word = getUnusedWord();
	}

	setWord(word);
	thisSession.addWord(word);
}

function getUnusedWord()
{
	var randomInt = Math.floor(Math.random() * wordObjectList.length);
	var unusedWord = wordObjectList[randomInt];

	var used = thisSession.checkWordUsed(unusedWord);

	//Only try to find an unused word if there are any left
	if(thisSession.getWordUsedLength < wordObjectList.length)
	{
		while (used)
		{
			randomInt = Math.floor(Math.random() * wordObjectList.length);
			unusedWord = wordObjectList[randomInt];
			used = thisSession.checkWordUsed(unusedWord);
		}
	}

	return unusedWord;
}

function sendKeyStroke (event) {
	//console.log("key: " + event.keyCode);
	receiveKey(event.keyCode);
	return false;
}

function cancelBackspace (event) {
	//console.log("key: " + event.keyCode);
	if (event.keyCode == 8 || event.keyCode == 9) {
		receiveKey(event.keyCode);
		return false;
	}
}

function receiveKey (key) {
	var typedLetter = String.fromCharCode(key);
	var nextLetter = globalWord.toString()[currentPosition];
	var clockTick = timer.tick();
	if (typedLetter == nextLetter) {
		recordLetter(typedLetter, lastLetter, clockTick);
		//var _letter = new Letter(typedLetter, clockTick, lastLetter, currentPosition);
		//lettersTyped.push(_letter);

		var letterDiv = $('#letter'+currentPosition);
		letterDiv.css("color", "red");
		lastLetter = nextLetter;
		thisSession.addCorrectLetter();
		advancePosition();
	} else {
		//var _mistake = new Mistake(nextLetter, lastLetter, clockTick, typedLetter);
		//mistakes.push(_mistake);
		thisSession.addMissedLetter();
		thisSession.resetStreak();
	}

	$("#stats").html(thisSession.toString());
}

function setNextWord (word) {
	globalNextWord = word;
	$("#nextWord").html(word.toString());
}

function getNextWord () {
	return globalNextWord;
}

function setWord (word) {
	globalWord = word;
	currentPosition = 0;
	var wordDiv = $('#wordDiv');
	var wordHtml = "";
	for (var i = 0; i < word.toString().length; i++) {
		wordHtml += '<span id="letter' + i + '">' + word.toString()[i] + '</span>';
	};

	wordDiv.html(wordHtml);

	var score = word.getDifficulty();
	var wordScoreDiv = $('#wordScoreDiv');
	wordScoreDiv.html(Number((score).toFixed(4)));
}

function initializeClassic() {
	displayWord('learn');
	displayWord('aspect');
	displayWord('variety');
	displayWord('guide');
	displayWord('crack');
	displayWord('rent');



	wordList = $.unique(wordList.match(/\w+/mg));

	setWordObjectList(wordList);

	getNewWord();
}

function setMode (newMode) {
	mode = newMode;
	if (mode == "classic") {
		initializeClassic();
	} else if (mode == 'rpg') {
		rpgManager.initialize();
	}
}

function createArray(length) {
	var a = new Array(length || 0);

	if (arguments.length > 1) {
	var args = Array.prototype.slice.call(arguments, 1);
		for (var i = 0; i < length; i++) {
			a[i] = createArray.apply(this, args);
		}
	}

return a;
}

//********************************************************************** PAGE LOADED *********************************************************************

var mode = "classic";
var rpgManager = new RpgManager();
var controller = new Controller();

$(document).ready( function() {
	$(document).keypress(function(event) { return sendKeyStroke(event) });
	$(document).keydown(function(event) { return cancelBackspace(event) });
	controller.init(wordList);
	setMode(mode);

//	$(document).keyup(function(event) { return false });
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