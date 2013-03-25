function UserSession() {
	this.missedLetters = 0;
	this.correctLetters = 0;
	this.streak = 0;
	this.difficultyLevel = 0;
	this.wordsCompleted = [];
	this.score = 0;
}

UserSession.prototype.addMissedLetter = function () 
{
	this.missedLetters++;
}

UserSession.prototype.addCorrectLetter = function () 
{
	this.correctLetters++;
}

UserSession.prototype.addWord = function (word) 
{
	this.wordsCompleted.push(word);
}

UserSession.prototype.resetStreak = function () 
{
	this.streak = 0;
}

UserSession.prototype.addStreak = function () 
{
	this.streak++;
}

UserSession.prototype.addScore = function (score) 
{
	this.score += score;
}

UserSession.prototype.getScore = function ()
{
	return Number((this.score).toFixed(4))
}

UserSession.prototype.advanceDifficulty = function ()
{
	this.difficultyLevel++;
}

UserSession.prototype.checkWordUsed = function (word)
{
	if (this.wordsCompleted.indexOf(word) > -1)
		return true;

	return false;
}

UserSession.prototype.getWordUsedLength = function (word)
{
	return this.wordsCompleted.length;
}

UserSession.prototype.toString = function () 
{
	var userHtml = "";

	userHtml += "<p class='stat' id='streak'>Streak: " + this.streak + "</p>";
	userHtml += "<p class='stat' id='score'>Score: " + this.getScore() + "</p>";
	userHtml += "<p class='stat' id='totalWord'>Total Words: " + this.getWordUsedLength() + "</p>";
	userHtml += "<p class='stat' id='missedLetters'>Missed Letters: " + this.missedLetters + "</p>";
	userHtml += "<p class='stat' id='correctLetters'>Correct Letters:" + this.correctLetters + "</p>";
	userHtml += "<p class='stat' id='difficultyLevel'>Difficulty Level:" + this.difficultyLevel + "</p>";

	return userHtml;
}