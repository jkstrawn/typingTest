<?php

class WordsController extends AppController {
	public $helpers = array('Html', 'Form');

	public function index() 
    {
		$this->set('words', $this->Word->find('all', array(
			'conditions' => array('Word.commonality' => 1),
			'order' => 'rand()',
			'limit' => 100,
		)));
    }

    public function getRandomWords($howMany = 1)
    {
    	$howMany = Sanitize::clean($howMany, array('encode' => false));

    	$this->set('data', $this->Word->find('all', array(
		   'order' => 'rand()',
		   'limit' => $howMany,
		)));

    	$this->render('/General/SerializeJson/');
    }

    public function addWord() 
    {
        if ($this->request->is('post')) {
            $this->Word->create();
            if ($this->Word->save($this->request->data)) {
                $this->Session->setFlash('Your word has been saved.');
                $this->redirect(array('action' => 'index'));
            } else {
                $this->Session->setFlash('Unable to add your word.');
            }
        }
    }
}

?>