<?php

class PostController {
	private $gateway;
	public function __construct( PostGateway $gateway) {
		$this->gateway = $gateway;
	}
	 public function processRequest(string $method, ?string $id) {
		if($id) {
			$this->processResourceRequest($method, $id);
		} else {
			$this->processCollectionRequest($method);
		}
	}

	private function processResourceRequest(string $method, string $id): void {
		$post = $this->gateway->get($id);
		switch($method) {
			case "GET":
				http_response_code(200);
				echo json_encode($post);
				break;
			case "PATCH":
				$data = (array) json_decode(file_get_contents("php://input"), true);
				$rows = $this->gateway->update($post, $data);
				http_response_code(200);
				echo json_encode(["message" => "Post with id $id updated","rows" =>  $rows]);
				break;
			case "DELETE": 
				$this->gateway->delete($post["post_id"]);
				http_response_code(200);
				echo json_encode(["message" => "Post with id $id deleted"]);
				break;
			
		default:
				http_response_code(405);
				header("Allow: GET, POST");
				break;
			}
	}

	private function processCollectionRequest(string $method): void {
		switch($method) {
			case "GET":
				echo json_encode($this->gateway->getAll());
				break;
			case "POST":
				$data = (array) json_decode(file_get_contents("php://input"), true);
				if(!empty($errors)) {
					http_response_code(422);
					echo json_encode(["errors" => $errors]);
					break;
				}
				$id = $this->gateway->create($data);
				http_response_code(201);
				echo json_encode([
					"message" => "Post with id $id created",
				]);
				break;
			default:
				http_response_code(405);
				header("Allow: GET, POST");
				break;
		}
	}
}
