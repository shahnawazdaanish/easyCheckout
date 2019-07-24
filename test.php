<?php


# Encryption Method for Tokenize
function AppInfoEncryptUpDate($data="", $key="") {
  $iv = openssl_random_pseudo_bytes(openssl_cipher_iv_length("aes-256-cbc"));
  $encrypted = openssl_encrypt($data, "aes-256-cbc", $key, 0, $iv);
  return base64_encode($iv . '|||' . $encrypted);
}


function AppInfoDecryptUpDate( $data="", $key="") {
  list($iv, $encrypted_data) = explode('|||', base64_decode($data), 2);
  return openssl_decrypt($encrypted_data, "aes-256-cbc", $key, 0, $iv);
}


//echo _special_ch("flightexpertbdappslive");

/* PHP */
$post_data = array();
$post_data['store_id'] = "demotest002live";
$post_data['store_passwd'] = "demotest002live22606";
$post_data['total_amount'] = "10";
$post_data['currency'] = "BDT";
$post_data['tran_id'] = "SSLCZ_TEST_".uniqid();
$post_data['success_url'] = "http://localhost/new_sslcz_gw/susansuccess.php";
$post_data['fail_url'] = "http://localhost/new_sslcz_gw/fail.php";
$post_data['cancel_url'] = "http://localhost/new_sslcz_gw/cancel.php";

# CUSTOMER INFORMATION
$post_data['cus_name'] = "Test Customer";
$post_data['cus_email'] = "test@test.com";
$post_data['cus_add1'] = "Dhaka";
$post_data['cus_add2'] = "Dhaka";
$post_data['cus_city'] = "Dhaka";
$post_data['cus_state'] = "Dhaka";
$post_data['cus_postcode'] = "1000";
$post_data['cus_country'] = "Bangladesh";
$post_data['cus_phone'] = "01711111111";
$post_data['cus_fax'] = "01711111111";

# SHIPMENT INFORMATION
$post_data['ship_name'] = "Store Test";
$post_data['ship_add1 '] = "Dhaka";
$post_data['ship_add2'] = "Dhaka";
$post_data['ship_city'] = "Dhaka";
$post_data['ship_state'] = "Dhaka";
$post_data['ship_postcode'] = "1000";
$post_data['ship_country'] = "Bangladesh";

# OPTIONAL PARAMETERS
$post_data['value_a'] = "ref001";
$post_data['value_b '] = "ref002";
$post_data['value_c'] = "ref003";
$post_data['value_d'] = "ref004";

# CART PARAMETERS
$post_data['cart'] = json_encode(array(
    array("product"=>"DHK TO BRS AC A1","amount"=>"200.00"),
    array("product"=>"DHK TO BRS AC A2","amount"=>"200.00"),
    array("product"=>"DHK TO BRS AC A3","amount"=>"200.00"),
    array("product"=>"DHK TO BRS AC A4","amount"=>"200.00")
));
$post_data['product_amount'] = "100";
$post_data['vat'] = "5";
$post_data['discount_amount'] = "5";
$post_data['convenience_fee'] = "3";
//$post_data['sms_ipn'] = "01730671731";


$post_data['token_key'] = AppInfoEncryptUpDate( json_encode(array("token_value"=>"", "token_ref"=>"ca04bf91675522debb01117dde6aede0") ) , "f5d66a527ff181486321bf7c3s7f54de");


# REQUEST SEND TO SSLCOMMERZ
$direct_api_url = "https://securepay.sslcommerz.com/gwprocess/v3.1/api.php";

$handle = curl_init();
curl_setopt($handle, CURLOPT_URL, $direct_api_url );
curl_setopt($handle, CURLOPT_TIMEOUT, 30);
curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
curl_setopt($handle, CURLOPT_POST, 1 );
curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE); # KEEP IT FALSE IF YOU RUN FROM LOCAL PC


$content = curl_exec($handle );

$code = curl_getinfo($handle, CURLINFO_HTTP_CODE);

if($code == 200 && !( curl_errno($handle))) {
  curl_close( $handle);
  $sslcommerzResponse = $content;
} else {
  curl_close( $handle);
  echo "FAILED TO CONNECT WITH SSLCOMMERZ API";
  exit;
}

# PARSE THE JSON RESPONSE
$sslcz = json_decode($sslcommerzResponse, true );

$token_data = (AppInfoDecryptUpDate( $sslcz['existingCards'], "f5d66a527ff181486321bf7c3s7f54de"));

$token_data = json_decode($token_data, true);

//echo $token_data['0']['token_value']; exit;


var_dump($token_data);
var_dump($sslcz);

$session_id = $sslcz['sessionkey'];

?>
<form action="https://securepay.sslcommerz.com/gwprocess/v3.1/gw.php?Q=DELETETOKEN&SESSIONKEY=<?php echo $session_id; ?>" method="POST">
  <input type='text' name='token_data' value='<?php echo AppInfoEncryptUpDate( json_encode(array("token_value"=>"1A335B729B3A3EDB51F0", "token_ref"=>"ca04bf91675522debb01117dde6aede0") ) ,"f5d66a527ff181486321bf7c3s7f54de" ); ?>'>
  <input type='submit' value="Go">
</form>
<?php
exit;
?>
<form action="https://securepay.sslcommerz.com/gwprocess/v3.1/gw.php?Q=TOKENIZE&SESSIONKEY=<?php echo $session_id; ?>" method="POST">
  <input type='text' name='token_data' value='<?php echo AppInfoEncryptUpDate( json_encode(array("token_value"=>"21055B93AAD841B40F16", "token_ref"=>"ca04bf91675522debb01117dde6aede0", "token_cvv"=>'256') ) ,"f5d66a527ff181486321bf7c3s7f54de" ); ?>>'>
  <input type='submit' value="Go">
</form>

<?php
exit;
if(isset($sslcz['GatewayPageURL']) && $sslcz['GatewayPageURL']!="") {
        # THERE ARE MANY WAYS TO REDIRECT - Javascript, Meta Tag or Php Header Redirect or Other
        # echo "<script>window.location.href = '". $sslcz['GatewayPageURL'] ."';</script>";
        echo "<meta http-equiv='refresh' content='0;url=".$sslcz['GatewayPageURL']."'>";
        # header("Location: ". $sslcz['GatewayPageURL']);
        exit;
} else {
  echo "JSON Data parsing error!";
}
