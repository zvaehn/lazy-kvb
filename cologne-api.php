<?php

$features = [
  'elevators' => "http://online-service.kvb-koeln.de/geoserver/OPENDATA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ODENDATA%3Aaufzuege_gestoert&outputFormat=application/json",
  'escalators' => "http://online-service.kvb-koeln.de/geoserver/OPENDATA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=ODENDATA%3Afahrtreppen_gestoert&outputFormat=application/json"
];

if($_GET['feature'] == "escalators") {
  sleep(1);
}

if(isset($_GET['feature']) && array_key_exists($_GET['feature'], $features)) {
  header("Content-Type: application/json");
  header('Access-Control-Allow-Origin: http://localhost:8080');
  header('Access-Control-Allow-Methods: GET, POST');
  header("Access-Control-Allow-Headers: X-Requested-With");

  $data = file_get_contents($features[$_GET['feature']]);
  echo $data;
}
else {
  die('Please provide a feature.');
}
