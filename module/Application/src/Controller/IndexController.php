<?php

namespace Application\Controller;

use Application\Entity\Image;
use Application\Form\Image as ImageForm;
use Application\Form\InputFilter\ImageInputFilter;
use Zend\View\Model\ViewModel;
use Zend\View\Model\JsonModel;

class IndexController extends AbstractController
{
    public function indexAction()
    {
        $this->getInlineScript()->appendScript(
            '$(function() {
                 Canvas.init($(\'#canvas-container\'));
             });',
            'text/javascript',
            ['defer' => true]
        );

        return (new ViewModel)
            ->setVariable('containerId', 'canvas-container');
    }

    public function listAction()
    {

    }

    private function getPreparedImageForm()
    {
        $form = new ImageForm;
        $form->setInputFilter(new ImageInputFilter);
        $form->setData($this->params()->fromPost());

        return $form;
    }

    private function getImageEntity(ImageForm $imageForm)
    {
        $data = $imageForm->getData();

        $image = new Image;
        $image->setName(md5(time()) . '.png');
        $image->setLogin($data['login']);
        $image->setPassword($data['password']);

        return $image;
    }

    public function saveAction()
    {
        $result = ['status'  => 'fail'];
        if ($this->getRequest()->isPost()) {
            $form = $this->getPreparedImageForm();
            if (!$form->isValid()) {
                return new JsonModel([
                    'status'  => 'fail',
                    'message' => 'Ошибка в передаче данных',
                ]);
            }

            $data = $form->getData();

            $dirPath = $_SERVER['DOCUMENT_ROOT'] . '/files/';
            $image = $this->getImageEntity($form);
            $fileName = $dirPath . $image->getName();
            try {
                file_put_contents($fileName, $data['image']);

                $this->entityManager->persist($image);
                $this->entityManager->flush($image);

                $result = [
                    'status'   => 'success',
                    'message'  => 'Изображение успешно сохранено',
                ];
            } catch (\Exception $e) {
                unlink($fileName);
                $result['message'] = 'Возникли ошибки при сохранении';
            }
        } else {
            $result['message'] = 'Не передан обязательный параметр';
        }

        return new JsonModel($result);
    }

    public function editAction()
    {

    }
}
