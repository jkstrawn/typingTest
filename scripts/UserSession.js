function UserSession() {
	this.totalWords = 0;
	this.missedLetters = 0;
	this.correctLetters = 0;
	this.streak = 0;
	this.difficultyLevel = 0;
}

UserSession.prototype.addMissedLetter = function () 
{
	this.missedLetters++;
}

UserSession.prototype.addCorrectLetter = function () 
{
	this.correctLetters++;
}

UserSession.prototype.addWord = function () 
{
	this.totalWords++;
}

UserSession.prototype.resetStreak = function () 
{
	this.streak = 0;
}

UserSession.prototype.addStreak = function () 
{
	this.streak++;
}

UserSession.prototype.advanceDifficulty = function ()
{
	this.difficultyLevel++;
}

UserSession.prototype.toString = function () 
{
	var userHtml = "";

	userHtml += "<p class='stat' id='streak'>Streak: " + this.streak + "</p>";
	userHtml += "<p class='stat' id='totalWord'>Total Words: " + this.totalWords + "</p>";
	userHtml += "<p class='stat' id='missedLetters'>Missed Letters: " + this.missedLetters + "</p>";
	userHtml += "<p class='stat' id='correctLetters'>Correct Letters:" + this.correctLetters + "</p>";
	userHtml += "<p class='stat' id='difficultyLevel'>Difficulty Level:" + this.difficultyLevel + "</p>";

	return userHtml;
}