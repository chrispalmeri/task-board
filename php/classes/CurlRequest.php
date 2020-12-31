<?php

class CurlRequest {
  public $code;
  public $body;

  function __construct($method, $url, $header = array(), $data = null) {
    $ch = curl_init();

    if(isset($data)) {
      curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    }

    curl_setopt_array($ch, array(
      CURLOPT_CUSTOMREQUEST => $method,
      CURLOPT_URL => $url,
      CURLOPT_HTTPHEADER => $header,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_RETURNTRANSFER => true
    ));

    $this->body = json_decode(curl_exec($ch));
    $this->code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);
  }
}
