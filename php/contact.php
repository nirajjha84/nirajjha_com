<?php

/* Set e-mail recipient */
$myemail  = "niraj84@gmail.com";
$subject = "Contact Us Form : nirajjha.com";

/* Check all form inputs using check_input function */
$Name = $_POST['senderName'];
$email = $_POST['senderEmail'];
$Subject = $_POST['subject'];
$message = $_POST['message'];

/* Let's prepare the message for the e-mail */
$message = "Hello!

A new user has posted his/her comment on nirajjha.com, please find the information below:
-----------------------------

Name: $Name
email: $email
Subject: $Subject
Message: $message

-----------------------------

Thanks.
";

/* Send the message using mail() function */
mail($myemail, $subject, $message);

/* Redirect visitor to the thank you page */
header('Location: http://www.nirajjha.com');
exit();

/* Functions we used */
function check_input($data, $problem='')
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    if ($problem && strlen($data) == 0)
    {
        show_error($problem);
    }
    return $data;
}

function show_error($myError)
{
?>
    <html>
    <body>

    <b>Please correct the following error:</b><br />
    <?php echo $myError; ?>

    </body>
    </html>
<?php
exit();
}
?>