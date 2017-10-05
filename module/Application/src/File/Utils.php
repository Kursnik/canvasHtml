<?php

namespace Application\File;

class Utils
{
    public static function appendDate($filePath)
    {
        preg_match('/^(.*).(js|css)$/', $filePath, $matches);
        $fileTime = filemtime($_SERVER['DOCUMENT_ROOT'] . $filePath);
        return "{$matches[1]}_{$fileTime}.{$matches[2]}";
    }
}
