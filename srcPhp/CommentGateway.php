<?php

class CommentGateway {
	private PDO $conn;
	public function __construct(Database $database) {
		$this->conn = $database->getConnection();
	}

	public function getAll(): array {
		$sql = "SELECT * FROM comments";
		$stmt = $this->conn->query($sql);
		$data = [];
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$data[] = $row;
		}
		return $data;
	}

	public function create(array $data): string {
		$sql = "INSERT INTO comments (user_id, post_id, message) VALUES (:user_id, :post_id, :message)";
		$stmt = $this->conn->prepare($sql);
		$stmt->bindValue(":user_id", $data["user_id"], PDO::PARAM_STR);
		$stmt->bindValue(":post_id", $data["post_id"], PDO::PARAM_STR);
		$stmt->bindValue(":message", $data["message"], PDO::PARAM_STR);

		$stmt->execute();

		return $this->conn->lastInsertId();	
	}

}