<?php

require __DIR__ . '/../classes/ApiEndpoint.php';

class Endpoint extends ApiEndpoint {
  function get($request) {
    $status = 200;
    $response = $request;
    return array($status, $response);
  }

  function post($request) {
    $status = 200;
    $response = $request;
    return array($status, $response);
  }

  function put($request) {
    $status = 200;
    $response = $request;
    return array($status, $response);
  }

  function delete($request) {
    $status = 200;
    $response = $request;
    return array($status, $response);
  }
}
