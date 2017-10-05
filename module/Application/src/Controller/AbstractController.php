<?php

namespace Application\Controller;

use Application\File\Utils;
use Doctrine\ORM\EntityManager;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Mvc\MvcEvent;
use Zend\View\Helper\HeadLink;
use Zend\View\Helper\HeadMeta;
use Zend\View\Helper\HeadScript;
use Zend\View\Helper\HeadTitle;
use Zend\View\Helper\InlineScript;
use Zend\View\HelperPluginManager;

abstract class AbstractController extends AbstractActionController
{
    /**
     * Entity manager.
     * @var EntityManager
     */
    protected $entityManager;

    public function __construct($entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @var string $repository Название репозитория
     *
     * @return \Doctrine\ORM\EntityRepository
     */
    protected function getRepository($repository)
    {
        return $this->entityManager->getRepository($repository);
    }

    /**
     * @return HelperPluginManager
     */
    protected function getViewHelperManager()
    {
        return $this->getEvent()->getApplication()->getServiceManager()->get('ViewHelperManager');
    }

    /**
     * @return HeadTitle
     */
    protected function getHeadTitle()
    {
        return $this->getViewHelperManager()->get('headTitle');
    }

    /**
     * @return HeadMeta
     */
    protected function getHeadMeta()
    {
        return $this->getViewHelperManager()->get('headMeta');
    }

    /**
     * @return HeadScript
     */
    protected function getHeadScript()
    {
        return $this->getViewHelperManager()->get('headScript');
    }

    /**
     * @return InlineScript
     */
    protected function getInlineScript()
    {
        return $this->getViewHelperManager()->get('inlineScript');
    }

    /**
     * @return HeadLink
     */
    protected function getHeadLink()
    {
        return $this->getViewHelperManager()->get('headLink');
    }

    protected function appendAdditionalScripts(array $jsList)
    {
        $headScript = $this->getHeadScript();
        foreach ($jsList as $jsPath) {
            $headScript->appendFile(Utils::appendDate($jsPath));
        }
    }

    protected function appendAdditionalStylesheets(array $cssList)
    {
        $headLink = $this->getHeadLink();
        foreach ($cssList as $cssPath) {
            $headLink->appendStylesheet(Utils::appendDate($cssPath), null);
        }
    }

    public function onDispatch(MvcEvent $e)
    {
        $this->appendAdditionalScripts([
            '/js/vendor/jquery.min.js',
            '/js/vendor/jquery.validate.min.js',
            '/js/main.js',
        ]);
        $this->appendAdditionalStylesheets(['/css/main.css']);

        return parent::onDispatch($e);
    }
}