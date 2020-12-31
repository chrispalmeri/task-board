<?php

class ApiEndpoint {
  public $status = 405;
  public $response = array('error' => 'method not allowed');

  function __construct() {
    $method = strtolower($_SERVER['REQUEST_METHOD']);

    if(method_exists($this, $method)) {
      $uriData = array();

      if(array_key_exists('route', $_GET)) {
        $args = preg_split('/\//', $_GET['route'], NULL, PREG_SPLIT_NO_EMPTY);
        unset($_GET['route']);
  
        $uriData['id'] = array_shift($args);
        $uriData['sub-resrc'] = array_shift($args);
        $uriData['sub-id'] = array_shift($args);
      }
      
      $postData = $_POST;

      if (isset($_SERVER['CONTENT_TYPE']) && $_SERVER['CONTENT_TYPE'] === 'application/json') {
        $post = file_get_contents('php://input');
        if(!empty($post)) {
          // should error check this
          $postData = json_decode($post, true);
        }
      }

      $request = array_merge($uriData, $_GET, $postData);
      list($this->status, $this->response) = call_user_func(array($this, $method), $request);
    }
  }
}
