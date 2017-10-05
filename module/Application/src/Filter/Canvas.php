<?php

namespace Application\Filter;

use Zend\Filter\FilterInterface;

class Canvas implements FilterInterface
{
    public function filter($value)
    {
        return base64_decode(substr($value, strpos($value, ",") + 1)) ;
    }
}