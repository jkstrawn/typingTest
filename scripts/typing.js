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

var keyboardList = [];
keyboardList[0] = new LetterRank(2.0, 1, 1);	// q
keyboardList[1] = new LetterRank(1.4, 2, 1);	// w 
keyboardList[2] = new LetterRank(1.3, 3, 1);	// e 
keyboardList[3] = new LetterRank(1.1, 4, 1);	// r
keyboardList[4] = new LetterRank(1.3, 4, 1);	// t
keyboardList[5] = new LetterRank(1.3, 9, 1);	// y
keyboardList[6] = new LetterRank(1.1, 9, 1);	// u
keyboardList[7] = new LetterRank(1.3, 8, 1);	// i
keyboardList[8] = new LetterRank(1.4, 7, 1);	// o
keyboardList[9] = new LetterRank(2.0, 6, 1);	// p

keyboardList[10] = new LetterRank(1.5, 1, 2);	// a
keyboardList[11] = new LetterRank(1.2, 2, 2);	// s
keyboardList[12] = new LetterRank(1.1, 3, 2);	// d
keyboardList[13] = new LetterRank(1.0, 4, 2);	// f
keyboardList[14] = new LetterRank(1.0, 4, 2);	// g
keyboardList[15] = new LetterRank(1.0, 9, 2);	// h
keyboardList[16] = new LetterRank(1.0, 9, 2);	// j
keyboardList[17] = new LetterRank(1.1, 8, 2);	// k
keyboardList[18] = new LetterRank(1.2, 7, 2);	// l
keyboardList[19] = new LetterRank(1.5, 6, 2);	// ;

keyboardList[20] = new LetterRank(2.5, 1, 3);	// z
keyboardList[21] = new LetterRank(2.0, 2, 3);	// x
keyboardList[22] = new LetterRank(1.7, 3, 3);	// c
keyboardList[23] = new LetterRank(1.2, 4, 3);	// v
keyboardList[24] = new LetterRank(1.2, 4, 3);	// b
keyboardList[25] = new LetterRank(1.2, 9, 3);	// n
keyboardList[26] = new LetterRank(1.2, 9, 3);	// m
keyboardList[27] = new LetterRank(1.7, 8, 3);	// ,
keyboardList[28] = new LetterRank(1.7, 7, 3);	// .
keyboardList[29] = new LetterRank(2.5, 6, 3);	// /

//determine difficulty of digraph for the key BEFORE this key
// P
keyboardList[9].digraph[5] = 1.4;
keyboardList[9].digraph[6] = 1.3;
keyboardList[9].digraph[7] = 1.5;
keyboardList[9].digraph[8] = 1.7;
keyboardList[9].digraph[9] = 0.0;			//same key
keyboardList[9].digraph[15] = 1.2;
keyboardList[9].digraph[16] = 1.3;
keyboardList[9].digraph[17] = 1.5;
keyboardList[9].digraph[18] = 1.8;
keyboardList[9].digraph[19] = 2.2;
keyboardList[9].digraph[25] = 1.2;
keyboardList[9].digraph[26] = 1.4;
keyboardList[9].digraph[27] = 2.0;
keyboardList[9].digraph[28] = 2.2;
keyboardList[9].digraph[29] = 2.5;

// O
keyboardList[9].digraph[5] = 1.4;
keyboardList[9].digraph[6] = 1.3;
keyboardList[9].digraph[7] = 1.5;
keyboardList[9].digraph[8] = 0.0;			//same key
keyboardList[9].digraph[9] = 2.2;
keyboardList[9].digraph[15] = 1.3;
keyboardList[9].digraph[16] = 1.2;
keyboardList[9].digraph[17] = 1.6;
keyboardList[9].digraph[18] = 2.0;
keyboardList[9].digraph[19] = 2.0;
keyboardList[9].digraph[25] = 1.4;
keyboardList[9].digraph[26] = 1.5;
keyboardList[9].digraph[27] = 2.0;
keyboardList[9].digraph[28] = 2.3;
keyboardList[9].digraph[29] = 2.3;

var dvorakLetterList = [];
dvorakLetterList[0] = keyboardList[10];
dvorakLetterList[1] = keyboardList[25];
dvorakLetterList[2] = keyboardList[7];
dvorakLetterList[3] = keyboardList[15];
dvorakLetterList[4] = keyboardList[12];
dvorakLetterList[5] = keyboardList[5];
dvorakLetterList[6] = keyboardList[6];
dvorakLetterList[7] = keyboardList[16];
dvorakLetterList[8] = keyboardList[14];
dvorakLetterList[9] = keyboardList[22];
dvorakLetterList[10] = keyboardList[23];
dvorakLetterList[11] = keyboardList[9];
dvorakLetterList[12] = keyboardList[26];
dvorakLetterList[13] = keyboardList[18];
dvorakLetterList[14] = keyboardList[11];
dvorakLetterList[15] = keyboardList[3];
dvorakLetterList[16] = keyboardList[21];
dvorakLetterList[17] = keyboardList[8];
dvorakLetterList[18] = keyboardList[19];
dvorakLetterList[19] = keyboardList[17];
dvorakLetterList[20] = keyboardList[13];
dvorakLetterList[21] = keyboardList[28];
dvorakLetterList[22] = keyboardList[27];
dvorakLetterList[23] = keyboardList[24];
dvorakLetterList[24] = keyboardList[4];
dvorakLetterList[25] = keyboardList[29];

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
	$(document).keypress(function(event) { return sendKeyStroke(event) });
	$(document).keydown(function(event) { return cancelBackspace(event) });
	displayWord('learn');
	displayWord('aspect');
	displayWord('variety');
	displayWord('guide');
	displayWord('crack');
	displayWord('rent');



	wordList = $.unique(wordList.match(/\w+/mg));

	setWordObjectList(wordList);

	getNewWord();
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
