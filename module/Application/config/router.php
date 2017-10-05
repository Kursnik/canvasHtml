<?php

namespace Application;

use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;

return [
    'routes' => [
        'home'         => [
            'type'    => Segment::class,
            'options' => [
                'route'       => '/[:action]',
                'defaults'    => [
                    'controller' => Controller\IndexController::class,
                    'action'     => 'index',
                ],
            ],
        ],
    ],
];