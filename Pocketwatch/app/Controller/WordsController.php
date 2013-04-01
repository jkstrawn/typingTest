class WordsController extends AppController {
    public $helpers = array('Html', 'Form');

    public function index() {
        $this->set('words', $this->Word->find(100));
    }
}