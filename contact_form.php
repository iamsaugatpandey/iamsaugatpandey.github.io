<?php
    if(isset($_POST['submit'])){
        $name = $_POST['name'];
        $mail_From = $_POST['email'];
        $message = $_POST['message'];

        $mailTo = "saugatpandey02@gmail.com";
        $header =  "From: ".$mail_From;
        $txt = "You have received an email from ".$name.".\n\n".$message;

        mail($mailTo, txt, $header);

        header("Location: index.php?mailsend");
    }
?>