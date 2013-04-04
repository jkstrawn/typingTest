<?php
echo $this->Html->css('styles');
echo $this->Html->script('jquery-1.8.3');
echo $this->Html->script('jquery-ui');
echo $this->Html->script('UserSession');
echo $this->Html->script('wordList');
echo $this->Html->script('typing');
echo $this->Html->script('keyboardList');
?>



        <div id="main">
            <div id="streakDiv"></div>
        </div>

        <div id="letterScores">

        </div>

        <div id="letterScoresa"></div>

        <div id="wordDiv">
            <span id="1">r</span><span id="2">u</span><span id="3">f</span><span id="4">f</span><span id="5">i</span><span id="6">a</span><span id="7">n</span>
        </div>

        <div id="HUD">
            <div id="nextWord">

            </div>
            <div id="stats">

            </div>
        </div>

        <div id="wordScoreDiv">00</div>

        <div id="keyboard">
            <input type="button" value="Choose Layout" onclick="openKeyboardLayout();">
            Layout: Dvorak
        </div>

        <div id="keyboard-box" class="keyboard-popup">
            <div id="keyboardSub">
                <h3>keyboard</h3>
                </br>
                <input type="button" value="Dvorak" onclick="chooseKeyboard('dvorak')">
                <input type="button" value="Qwerty" onclick="chooseKeyboard('qwerty')">
            </div>
        </div>

        <button type="button" onclick="setMode('rpg')"> RPG Mode </button>
<!--
<h1>Random Words</h1>
<table>
    <tr>
        <th>Id</th>
        <th>Word Content</th>
        <th>Difficulty</th>
    </tr>
    
    <!-- Here is where we loop through our $posts array, printing out post info -->
    <?phpecho $this->Session->flash(); ?>

    <?php foreach ($words as $word): ?>
    <tr>
        <td><?php echo $word['Word']['id']; ?></td>
        <td>
            <?php echo $this->Html->link($word['Word']['wordContent'], array('controller' => 'words', 'action' => 'view', $word['Word']['id'])); ?>
        </td>
        <td><?php echo $word['Word']['difficulty']; ?></td>
    </tr>
    <?php endforeach; ?>
    <?php unset($word); ?>
</table> -->
