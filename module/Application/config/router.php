<?php

namespace Application;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;

return [
    'routes' => [
        'home'         => [
            'type'    => Segment::class,
            'options' => [
                'route'       => '/',
                'defaults'    => [
                    'controller' => Controller\IndexController::class,
                    'action'     => 'index',
                ],
            ],
        ],
    ],
];