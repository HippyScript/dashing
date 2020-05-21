<?php

	$uploaddir = '/var/www/html/res/apps/';
	$file_type = pathinfo($_FILES['appIcon']['name'], PATHINFO_EXTENSION);
	echo print_r($_POST);
	if ($file_type != "gif" && $file_type != "svg" && $file_type != "jpg" && $file_type != "jpeg" && $file_type != "png") {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
		echo "File type must be gif, svg, jpeg or png; this file is " . $file_type;
		die();
	}
	if(file_exists($uploaddir . $_FILES['appIcon']['name'])) {
		unlink($uploaddir . $_FILES['appIcon']['name']);
	}
	if (move_uploaded_file($_FILES['appIcon']['tmp_name'], $uploaddir . $_FILES['appIcon']['name'])) {
		$ini_file = fopen('../apps/apps.ini', 'a') or die("Unable to open file!");
		fwrite($ini_file, "\n\n[" . $_POST["appName"] . "]\n");
		fwrite($ini_file, "icon = " . $_FILES['appIcon']['name'] . "\n");
		fwrite($ini_file, "url = " . $_POST["appLink"] . "\n");
		fclose($ini_file);

	}
	else {
		header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
		echo "Could not upload file. Does the http server user have write permissions to res/apps?";
		die();
	}


?>