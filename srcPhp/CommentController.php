<?php

class CommentController {
	private $gateway;
	public function __construct(CommentGateway $gateway) {
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
		switch($method) {
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
				$id = $this->gateway->create($data);
				http_response_code(201);
				echo json_encode([
					"message" => "Comment with id $id created",
					"id" => $id
				]);
				break;
			default:
				http_response_code(405);
				header("Allow: GET, POST");
				break;
		}
	}



}
