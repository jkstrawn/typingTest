<?php
	$username = "root";
	$password = "";
	$hostname = "localhost"; 

	$link = mysqli_connect('localhost', 'root', '', 'test');

	if (!$link) {
	    //error
	}



	if (mysqli_query($link, "INSERT INTO tiles VALUES('tet', 'test', 'test', false)") === TRUE) {
	   //echo "{'a': 'Table myCity successfully created.'}";
	   echo '{"a": "Table myCity successfully created."}';
	}


?>