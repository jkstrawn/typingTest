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

//*****************************************************************************************************************************************************************
//******************************************************************* CONTROLLER **********************************************************************************
//*****************************************************************************************************************************************************************
function Controller() {
	this.lettersTyped = [];
	this.wordsType = [];
	this.mistakes = [];

	this.letterList = [];

	this.currentWord;
	this.nextWord;
	this.currentPosition = 0;
	this.letterStreak = 0;
	this.currentLetter = ' ';
	this.firstLetter = true;

	this.session = new UserSession();
	this.wordObjectList = [];
	this.timer = new Timer();
}

Controller.prototype.init = function(wordList) {

	for (var i = 0; i < 26; i++) {
		this.letterList[i] = new Key();
	}

	displayWord('treat');
	displayWord('against');
	displayWord('break');
	displayWord('pasta');
	displayWord('cope');
	displayWord('jaw');

	var wordList = $.unique(wordList.match(/\w+/mg));

	this.setWordObjectList(wordList);

	this.getNewWord();
}

//Initiate the list of all words that can be used
Controller.prototype.setWordObjectList = function(wordsList) {
	var that = this;
	$.each(wordsList, function (index, element) {
		var currWord = new Word();

		currWord.setContent(element);
		currWord.setDifficulty(that.getWordScore(element));

		that.wordObjectList.push(currWord);
	});
}

//Grab a new word from the list of total words and set it as the next word to use
Controller.prototype.getNewWord = function() {
	var _nextWord = this.getUnusedWord();

	var wordToUse = this.nextWord;

	this.setNextWord(_nextWord);

	//The first time there will not be a word in the next div, so give a new random one
	if (wordToUse == undefined) {
		wordToUse = this.getUnusedWord();
	}
	
//	$(document).keyup(function(event) { return false });
});

	this.setWord(wordToUse);
	this.session.addWord(wordToUse);
}

Controller.prototype.setNextWord = function(word) {
	this.nextWord = word;
	$("#nextWord").html(word.toString());
}

//Get a word that has not been used yet from the word object list
Controller.prototype.getUnusedWord = function() {
	var randomInt = Math.floor(Math.random() * this.wordObjectList.length);
	var unusedWord = this.wordObjectList[randomInt];

	var isWordUsed = this.session.checkWordUsed(unusedWord);

	//Only try to find an unused word if there are any left
	if(this.session.getWordUsedLength < this.wordObjectList.length) {
		while (isWordUsed) {
			//get a new word if the word is used
			randomInt = Math.floor(Math.random() * this.wordObjectList.length);
			unusedWord = this.wordObjectList[randomInt];
			isWordUsed = this.session.checkWordUsed(unusedWord);
		}
	}

	return unusedWord;
}

//Set the word onto page for the user to type
Controller.prototype.setWord = function(word) {
	this.currentWord = word;
	this.currentPosition = 0;
	var wordDiv = $('#wordDiv');
	var wordHtml = "";

	//create the individual letter spans (so they can be colored as they are typed)
	for (var i = 0; i < word.toString().length; i++) {
		wordHtml += '<span id="letter' + i + '">' + word.toString()[i] + '</span>';
	};

	wordDiv.html(wordHtml);

	var score = word.getDifficulty();
	var wordScoreDiv = $('#wordScoreDiv');	
	//Set the score of the word onto the score div
	wordScoreDiv.html(Number((score).toFixed(4)));
}

//Update the timings on the page for the individual letters typed
Controller.prototype.displayLetterTime = function() {
	var letterScoresDiv = $('#letterScores');
	var html = "<table>";
	for (var i = 0; i < 26; i++) {
		html += "<tr><td>" + String.fromCharCode(i+97) + "</td><td>" + this.letterList[i].averageTime + "ms</td></tr>";
	}
	html += "</table>";
	letterScoresDiv.html(html);
}

//Record a key that was typed, and add the timing to the letter list
Controller.prototype.recordLetter = function(letter, previous, time) {
	var index = letter.charCodeAt(0)-97;
	this.letterList[index].setLetterTiming(time);
	this.displayLetterTime();
}

Controller.prototype.advancePosition = function() {
	this.currentPosition++;
	this.session.addStreak();

	if (this.currentPosition >= this.currentWord.toString().length) {
		this.session.addScore(this.currentWord.getDifficulty());
		this.getNewWord();
	}
}

Controller.prototype.getWordScore = function(word) {
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
		var score = keyboardList[dvorak[letterCode]].score;
		var row = keyboardList[dvorak[letterCode]].row;
		var finger = keyboardList[dvorak[letterCode]].finger;
		var hand = (finger < 5) ? 1 : 2;

		//add word length difficulty modifier
		score += .07*i;

		if (previousHand == hand) {
			if (previousLetter >= 0) {
				//add digraph difficulty
				score += keyboardList[dvorak[letterCode]].digraph[dvorak[previousLetter]];
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
	var nextLetter = this.currentWord.toString()[this.currentPosition];
	var clockTick = this.timer.tick();

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
		this.recordLetter(typedLetter, this.currentLetter, clockTick);
		//var _letter = new Letter(typedLetter, clockTick, currentLetter, currentPosition);
		//lettersTyped.push(_letter);

		var letterDiv = $('#letter'+this.currentPosition);
		letterDiv.css("color", "red");
		this.currentLetter = nextLetter;
		this.session.addCorrectLetter();
		this.advancePosition();
	} else {
		//var _mistake = new Mistake(nextLetter, currentLetter, clockTick, typedLetter);
		//mistakes.push(_mistake);
		this.session.addMissedLetter();
		this.session.resetStreak();
	}

	$("#stats").html(this.session.toString());
}

function setNextWord (word) {
	globalNextWord = word;
	$("#nextWord").html(word.toString());
}

//*****************************************************************************************************************************************************************
//****************************************************************** RPG MANAGER **********************************************************************************
//*****************************************************************************************************************************************************************

function RpgManager() {
	var zone = "";
	var character = "";
}

RpgManager.prototype.initialize = function() {
	$('body').css({"background-image": "url('img/home.png')", "background-repeat": "no-repeat"});

	var html = "<div id='actions' style='margin-top:200px; margin-left:500px'><table><tr><td><button type='button' onclick='rpgManager.goToMap()'> View Map </button></td></tr></table></div>";
	$('body').html(html);


}

RpgManager.prototype.setZone = function(zone) {
	this.zone = zone;

	if (zone == "plains") {
		$('body').css({"background-image": "url('img/plains.png')"});
		var monsters = "<div style='float:left; margin-right:50px;'><img src='img/cow.png' /></div><div style='float:left'><img src='img/cow.png' /></div>";
		var html = "<div style='margin-top:500px; margin-left:500px'>" + monsters + "</div>";
		$('body').html(html);
	}
}

RpgManager.prototype.goToMap = function() {
	$('body').css({"background-image": "url('img/map.png')"});

	var html = "<div style='margin-left:400px; margin-top:300px'><img src='img/plains-icon.png' onclick=\"rpgManager.setZone('plains')\" /></div>";
	$('body').html(html);
}