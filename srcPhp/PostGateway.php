<?php

class PostGateway {
	private PDO $conn;
	public function __construct(Database $database) {
		$this->conn = $database->getConnection();
	}

	public function getAll(): array {
		$sql = "SELECT * FROM posts INNER JOIN users ON posts.user_id = users.user_id  ORDER BY time DESC";
		$stmt = $this->conn->query($sql);
		$data = [];
		while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
			$data[] = $row;
		}
		return $data;
	}

	public function create(array $data): string {
		$sql = "INSERT INTO posts (user_id, img, description) VALUES (:user_id, :img, :description)";
		$stmt = $this->conn->prepare($sql);
		$stmt->bindValue(":user_id", $data["user_id"], PDO::PARAM_STR);
		$stmt->bindValue(":img", $data["img"], PDO::PARAM_STR);
		$stmt->bindValue(":description", $data["description"], PDO::PARAM_STR);

		$stmt->execute();

		return $this->conn->lastInsertId();	
	}

	public function get(string $post_id): array {
		$sql = "SELECT * FROM posts WHERE post_id= :post_id";
		$stmt = $this->conn->prepare($sql);
		$stmt->bindValue(":post_id", $post_id, PDO::PARAM_INT);
		$stmt->execute();

		$data = $stmt->fetch(PDO::FETCH_ASSOC);
		return $data;
	}


	public function delete(string $post_id): void {
		$sql = "DELETE FROM comments WHERE post_id= :post_id";
		$stmt = $this->conn->prepare($sql);
		$stmt->bindValue(":post_id", $post_id, PDO::PARAM_INT);
		$stmt->execute();

		$sql = "DELETE FROM posts WHERE post_id= :post_id";
		$stmt = $this->conn->prepare($sql);
		$stmt->bindValue(":post_id", $post_id, PDO::PARAM_INT);
		$stmt->execute();
	}

	public function update(array $current,array $new): int
    {
        $sql = "UPDATE posts
                SET isLiked = :isLiked, likeAmount = :likeAmount, isBookmarked = :isBookmarked
                WHERE post_id = :post_id";
                
        $stmt = $this->conn->prepare($sql);
        
        $stmt->bindValue(":isLiked", $new["isLiked"] ?? $current["isLiked"], PDO::PARAM_BOOL);
        $stmt->bindValue(":likeAmount", $new["likeAmount"] ?? $current["likeAmount"], PDO::PARAM_INT);
        $stmt->bindValue(":isBookmarked", $new["isBookmarked"] ?? $current["isBookmarked"], PDO::PARAM_BOOL);
        $stmt->bindValue(":post_id", $new["post_id"]?? $current["post_id"] , PDO::PARAM_INT);
        $stmt->execute();

		return $stmt->rowCount();
    }
}