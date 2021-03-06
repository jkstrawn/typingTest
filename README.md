typingTest
==========

Browser-based typing test game

## To Do ##
+ Add game elements
+ Show typing streak prominently
+ Make mistakes visible
+ Clear entire word when a mistake is made
+ Get consecutive-key difficulty
+ Server to store word statistics -  I can do this, but we will need to move it into a private repo so the connection info isn't public
+ I want to add where when you finish a word it slides of the screen and then the next slides in, I am going to look at this fiddle when I get a chance, http://jsfiddle.net/jtbowden/ykbgT/
+ Map each word to a difficulty after storing in a database, then only get words for the current difficulty level, then when advance get a new set of words that are atthe next level
+ Add loading gif for beginning initializing
+ Filter next words based on difficulty
+ Add score to session based on percent correct of word to calculate real score on the finished word

## Partially Done ##
+ Word difficulty algorithm


## Done ##
+ Randomly generate word
+ Type through word and generate next one
+ Add next-word preview
+ Calculate all difficulties for words and store them all in an array of word objects at initialization
+ Store words done in current session and make sure new word is not in the session so no repeats

## Ideas ##

### Hangman Style ###
+ For every mistake, your avatar loses a limb until you die
 
### Duel Hangman ###
+ You fill up a grid as you type
+ When you make a mistake in a section of the grid, you lose a limb
+ When you fill up a section with no mistakes, your opponent loses a limb
+ I like this, that would be a really cool way to do multiplayer - JW

### Character Building ###
+ Create and play a character through the sessions, leveling up etc.
+ Custom made character who reacts in different ways

### Hunting, Collecting, Unlocking ###
+ The insatiable appetite for new gear
+ Finding everything the designers put in the game
+ Grinding
+ Unlock next level by passing a certain time

### Personal Records ###
+ Preset typing levels that you re-do over time to show your increase in speed

### Element of Chance ###
+ Gain rewards randomly through letter streaks

## Achievements ##

### General streaks ###
+ Typed 100 letters without making a mistake

### Certain number of rare letters typed correctly in a row ###
+ Correctly typed 'Q' the last 5 times it came up

### Speed ###
+ Average speed of the letter less than 100msec
