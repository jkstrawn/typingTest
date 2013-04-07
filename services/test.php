<?php
	$username = "root";
	$password = "";
	$hostname = "localhost"; 

	$link = mysqli_connect('localhost', 'root', '', 'test');

	if (!$link) {
	    //error
	} /*else {
		echo json_encode(array('a' => "Sucsess", 'b' => mysqli_get_host_info($link)));

		mysqli_close($link);

	}*/

	if ($result = mysqli_query($link, "SELECT * FROM tiles LIMIT 10")) {
		//printf("Select returned %d rows.\n", );

		echo json_encode(mysqli_fetch_all($result));

		/* free result set */
		mysqli_free_result($result);
	}



?>