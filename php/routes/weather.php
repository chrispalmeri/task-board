<?php

require __DIR__ . '/../classes/CurlRequest.php';
require __DIR__ . '/../classes/ApiEndpoint.php';

class Endpoint extends ApiEndpoint {
  function get($input) {
    if(array_key_exists('id', $input) && $input["id"] === 'forecast') {

      $response = new CurlRequest("GET",
        "https://api.weather.gov/gridpoints/" . $_SERVER['NOAA_GRID'] . "/forecast",
        array(
          'User-Agent: ' . $_SERVER['NOAA_AGENT'],
          'Accept: application/geo+json'
        )
      );

      if($response->body && property_exists($response->body, 'properties')) {
        return array(200, array(
          'name' => $response->body->properties->periods[0]->name,
          'description' => $response->body->properties->periods[0]->detailedForecast
        ));
      } else {
        return array($response->code, $response->body);
      }

    } else {

      $response = new CurlRequest("GET",
        "https://api.weather.gov/stations/" . $_SERVER['NOAA_STATION'] . "/observations/latest",
        array(
          'User-Agent: ' . $_SERVER['NOAA_AGENT'],
          'Accept: application/geo+json'
        )
      );
      
      return array(200, array(
        'temperature' => round(($response->body->properties->temperature->value * 9 / 5) + 32)
      ));

    }
  }
}
