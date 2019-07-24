<?php

function cors() {

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
        header('X-Frame-Options: {$_SERVER['HTTP_ORIGIN']}');
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        //exit(0);
    }

    //echo "You have CORS!";
}

cors();


^api.php\/(.*)*$

require 'vendor/autoload.php';
use GuzzleHttp\Psr7;
use GuzzleHttp\Exception\RequestException;


$main_url = "https://nookdev.sslcommerz.com/";
$baseurl = $main_url . "api/angular";
$path = $_SERVER['PATH_INFO'];
//var_dump($_REQUEST);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
     // The request is using the POST method
     //var_dump($_POST);
     echo comm($baseurl . $path, "POST", $_POST);
}
else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
     // The request is using the POST method
     //var_dump($_GET);
     //echo $baseurl . $path ; exit;
  echo comm($baseurl . $path, "GET");
}
else{
  echo comm($baseurl . $path, $_SERVER['REQUEST_METHOD'], $_REQUEST);
}



function comm($url, $method, $data=[]){
  $token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc1M2FmMmEwM2ZkMjc1YThkMzgwZjczMmEyYmEyZTU3MjczZDM0Mzg0NDNmOGZkMTJkNTliMGQ2ZjQxZTI5ZjY1ZDI3NzQ1YzNmMTIzOWUzIn0.eyJhdWQiOiIxIiwianRpIjoiNzUzYWYyYTAzZmQyNzVhOGQzODBmNzMyYTJiYTJlNTcyNzNkMzQzODQ0M2Y4ZmQxMmQ1OWIwZDZmNDFlMjlmNjVkMjc3NDVjM2YxMjM5ZTMiLCJpYXQiOjE1MzM1NjUyMTIsIm5iZiI6MTUzMzU2NTIxMiwiZXhwIjoxNTY1MTAxMjEyLCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.mBKmdpdyzX62rcK7PRZ1a44icrw01fk-d718bDRtaF0jXowDtvzwsOZgMmD-QeXIG2DdkWeTozg5eNDO5SRFa1Z01N3OAg_eackPVxK0wSXLAkMX3sSkk_9A_PK8vsposlmDIqDKoa3ItwfVV-W4EYjwknhSBljMX0wSgHYYnmYT6qCv6Q4ckgNsqr31uQb9GMfJjS8bC9h9wZH6HLB_QklZdR25g_doXg_EmrL4AhyQG85szTSTW3tqqZJqfrYruRXO4xeIk-y_W2aZS9G3APBczcj2YTv00nmagNa21pUHlKWANuFhjtJtXf4XGTl73qViNptR3nvhZ1RkW6pUTTeX3EhCkuNLKXT1m6Fd2YcnznSpQ8Uo2kvroEsJXayE8SYauhL-zpb9NEo1lzfmznW55sk9iHvEL0WK6n5eZ1H7HSiIbS-yYA0FnKHwHUyKyg7UvvyNxLu_95iGsmV4pQcI_HU2tT06Ij0ilzQkrpfP2-pqzm2TIRltT6kys2LH_l0S6VNe5dVjnZNJpwBdUFBLbtbb2Nuq2EkvuMr12jwZvYUdTINnt4fRQ2YB2WMGzjc35krtiO3puNRAvu0c8vALSKISIshJoe3qp3F-2YWkxN2I8fQ86jmcmVHzgBKTvI9k1FNnARbXKZiJZV5KQ4WsPc0sNTNVwKxRlo5kcEs';
  try{
    if($method == "GET"){

      $client = new GuzzleHttp\Client();
      // Create a PSR-7 request object to send
      $headers = ['headers' => ['Authorization' => 'Bearer '.$token,'Username' => 'sdaanish@live.com']];
      $promise = $client->request('GET', $url, $headers);
      return $promise->getBody();
    }
    else if($method == "POST"){
        $client = new \GuzzleHttp\Client();

        $response = $client->request('POST', $url, [
          'form_params' => $data,
          'headers' => [
            'Content-Type' => 'application/x-www-form-urlencoded',
            'Authorization' => 'Bearer '.$token,
            'Username' => 'sdaanish@live.com'
          ]
        ]);
        return $resp = $response->getBody();
    }
    else{
      $client = new GuzzleHttp\Client();
      // Create a PSR-7 request object to send
      $headers = ['headers' => ['Authorization' => 'Bearer '.$token,'Username' => 'sdaanish@live.com']];
      $promise = $client->request($method, $url, $headers);
      return $promise->getBody();
    }
  } catch (RequestException $e) {
    //echo Psr7\str($e->getRequest());
    if ($e->hasResponse()) {
      return json_encode(['status' => 'fail', 'message' => Psr7\str($e->getResponse())]);
    }
    else{
      return json_encode(['status' => 'fail', 'message' => Psr7\str($e->getRequest())]);
    }
  }
}

function regenToken() {
  $client = new GuzzleHttp\Client();
  $response = $client->post( 'https://nookdev.sslcommerz.com/oauth/token', [
    'form_params' => [
      'client_id' => 2,
      // The secret generated when you ran: php artisan passport:install
      'client_secret' => 'fx5I3bspHpnuqfHFtvdQuppAzdXC7nJclMi2ESXj',
      'grant_type' => 'password',
      'username' => 'johndoe@scotch.io',
      'password' => 'secret',
      'scope' => '*',
    ]
  ]);
}
