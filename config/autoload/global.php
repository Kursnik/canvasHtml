<?php

return [
    'db'              => [
        'driver'    => 'Pdo_Pgsql',
        'database ' => 'blog',
        'hostname'  => 'localhost',
        'charset'   => 'utf8',
    ],
    'service_manager' => [
        'factories' => [
            'Zend\Db\Adapter\Adapter' => 'Zend\Db\Adapter\AdapterServiceFactory',
        ],
    ],
];
