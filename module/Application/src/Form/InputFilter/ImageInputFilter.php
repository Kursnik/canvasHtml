<?php

namespace Application\Form\InputFilter;

use Application\Filter\Canvas;
use Zend\InputFilter\InputFilter;

class ImageInputFilter extends InputFilter
{
    function __construct()
    {
        $this->add([
            'name'     => 'id',
            'required' => false,
        ]);

        $this->add([
            'name'     => 'login',
            'required' => true,
            'filters'  => [
                ['name' => 'HtmlEntities'],
                ['name' => 'StringTrim'],
            ],
        ]);

        $this->add([
            'name'     => 'password',
            'required' => true,
            'filters'  => [
                ['name' => 'HtmlEntities'],
            ],
        ]);

        $this->add([
            'name'     => 'image',
            'required' => true,
            'filters'  => [
                ['name' => Canvas::class],
            ],
        ]);
    }
}