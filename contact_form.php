<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $email_from = 'saugatpandey02@gmail.com';
    $email_subject = 'New Form Submission';

    $email_body = "Name: $name.\n".
                    "Email: $email.\n".
                        "Message: $message.\n";
    
    $to = "saugatpandey02@gmail.com";

    $header = "From: $email_from \r\n";
    $header .= "Reply-To: $email \r\n";

    mail($to,$email_subject, $email_body, $header);

    header("Location: index.html"); 

?>