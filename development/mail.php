<?php

// form fields
$name = $_POST["name"];
$email = $_POST["email"];
$comments = $_POST["comments"];

// recipients
$to  = "cheryl.laird@outlook.com";

// subject
$subject = "Cheryl Laird Portfolio Contact Us";

// message
$message = "
<html xmlns=\"http://www.w3.org/1999/xhtml\">
<head>
		<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />
		<meta name=\"viewport\" content=\"width=device-width\"/>
</head>
<body>
	<table>
    	<tr>
    		<td><b>From:</b> </td>
    		<td>$name</td>
      </tr>
      <tr>
        <td><b>Email:</b> </td>
        <td>$email</td>
      </tr>
      <tr>
    		<td><b>Comments:</b> </td>
    		<td>$comments</td>
  		</tr>
  	</table>
</body>
</html>
";

// To send HTML mail, the Content-type header must be set
$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n";

// Additional headers
$headers .= "From: hello@cheryllaird.co.uk" . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";

// Mail it
mail($to, $subject, $message, $headers);
header("Location: http://www.cheryllaird.co.uk/");

?>