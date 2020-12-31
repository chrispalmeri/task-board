<?php

header('Content-type: application/json');
header('Cache-control: no-cache');

$status = 404;
$response = array('error' => 'not found');

$args = preg_split('/\//', $_GET['route'], NULL, PREG_SPLIT_NO_EMPTY);
$target = __DIR__ . '/../../php/routes/' . array_shift($args) . '.php';

if (is_file($target)) {
  $_GET['route'] = implode('/', $args);

  require $target;

  $output = new Endpoint();

  $status = $output->status;
  $response = $output->response;
}

http_response_code($status);
if(isset($response)) {
  print_r(json_encode($response));
}
