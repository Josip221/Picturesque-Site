<?php

declare(strict_types = 1);

// headers to avoid CORS policy error on localhost
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: HEAD, GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization");
	header("HTTP/1.1 200 OK");
	die();
}


// automatically load/import php files from /src
spl_autoload_register(function ($class){
	require __DIR__ . "/srcPhp/$class.php";
});

// error middleware
set_error_handler("ErrorHandler::handleError");
set_exception_handler("ErrorHandler::handleException");

$parts = explode("/", $_SERVER["REQUEST_URI"]);

if($parts[4] != "pzi_seminar" || !isset($parts[2]) || ($parts[5] != "post" && $parts[5] != "comment")) {
	http_response_code(404);
	echo json_encode(["error" => "URL Not found"]);
	exit;
}

$id = $parts[6] ?? null;

$database = new Database("", "", "", "");

switch($parts[5]) {
	case "post": 
		$postGateway = new PostGateway($database);
		$postController = new PostController($postGateway);
		$postController->processRequest($_SERVER["REQUEST_METHOD"], $id);
		break;
	case "comment":
		$commentGateway = new CommentGateway($database);
		$commentController = new CommentController($commentGateway);
		$commentController->processRequest($_SERVER["REQUEST_METHOD"], $id);
		break;
	default:
	break;
}

