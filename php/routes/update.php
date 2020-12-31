<?php

require __DIR__ . '/../classes/ApiEndpoint.php';

class Endpoint extends ApiEndpoint {
  // really GET should tell you if there are updates available
  // and POST should perform the update
  function get($request) {
    $command = "git pull && rsync -av --delete --delete-excluded --include='www/***' --include='php/***' --exclude='*' /home/www-data/task-board/ /srv/task-board/ 2>&1";
    $output = array();
    $result = '';
    
    chdir('/home/www-data/task-board'); // should catch errors from this
    exec($command, $output, $result);

    return array(200, array(
      'directory' => getcwd(),
      'command' => $command,
      'output' => $output,
      'result' => $result
    ));
  }
}
