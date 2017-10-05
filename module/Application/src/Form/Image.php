<?php

namespace Application\Form;

use Zend\Form\Element\Number;
use Zend\Form\Element\Password;
use Zend\Form\Element\Text;
use Zend\Form\Form;

class Image extends Form
{
    public function __construct()
    {
        parent::__construct();

        $this->add([
            'type' => Number::class,
            'name' => 'id',
        ]);

        $this->add([
            'type' => Text::class,
            'name' => 'login',
        ]);

        $this->add([
            'type' => Password::class,
            'name' => 'password',
        ]);

        $this->add([
            'type' => Text::class,
            'name' => 'image',
        ]);
    }
}