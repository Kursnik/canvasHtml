<?php

namespace Application\Controller;

use Zend\Db\Adapter\Adapter;
use Zend\Db\Adapter\Driver\Pgsql;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

abstract class AbstractController extends AbstractActionController
{
    private $dbAdapter;

    public function __construct(Adapter $dbAdapter = null)
    {
        $this->dbAdapter = $dbAdapter;
    }

    private final function getConnection()
    {
        return $this->dbAdapter->getDriver()->getConnection();
    }

    protected function getDefaultHelperModel()
    {
        return new ViewModel;
    }

    protected final function beginTransaction()
    {
        $this->getConnection()->beginTransaction();
    }

    protected final function commit()
    {
        $this->getConnection()->commit();
    }

    protected final function rollback()
    {
        $this->getConnection()->rollback();
    }

    protected final function executeQuery($sql, array $binds = [])
    {
        return $this->dbAdapter->query($sql)->execute($binds);
    }
}