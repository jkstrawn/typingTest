<?php

class WordsController extends AppController {
    public $helpers = array('Html', 'Form');

    public function index() {
        $this->set('words', $this->Word->find('all', array(
		   'order' => 'rand()',
		   'limit' => 100,
		)));
    }
}

?>