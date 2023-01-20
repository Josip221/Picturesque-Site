const url = "http://pzi.fesb.hr/MareticJ/Seminar/index.php/pzi_seminar";

const getAllFeedPosts = async () => {
  return await fetch(`${url}/post`, {
    method: "GET",
  });
};

//to do
const createFeedPost = async (data) => {
  return await fetch(`${url}/post`, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

const deleteFeedPost = async (post_id) => {
  return await fetch(`${url}/post/${post_id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const createComment = async (message, post_id) => {
  return await fetch(`${url}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      post_id,
      user_id: 1,
    }),
  });
};

const getAllPostComments = async () => {
  return await fetch(`${url}/comment`, {
    method: "GET",
  });
};

const updatePost = async (post) => {
  return await fetch(`${url}/post/${post.post_id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      isLiked: post.isLiked,
      likeAmount: post.likeAmount,
      isBookmarked: post.isBookmarked,
    }),
  });
};

const getPostTimeDifference = (time) => {
  const timeCurr = new Date(Date.now()).toISOString();
  const timePostISO = new Date(time).toISOString();
  let newTime;
  if (timeCurr.split("T")[0] > timePostISO.split("T")[0]) {
    const diff =
      new Date(timeCurr.split("T")[0]).getTime() -
      new Date(timePostISO.split("T")[0]).getTime();
    newTime = `${Math.ceil(diff / (1000 * 60 * 60 * 24))}d`;
  } else {
    const diff =
      timeCurr.split("T")[1].split(".")[0].split(":")[0] -
      timePostISO.split("T")[1].split(".")[0].split(":")[0];
    newTime = `${diff}h`;
    if (newTime === "0h") newTime = "1h";
  }
  return newTime;
};

export {
  getAllFeedPosts,
  createFeedPost,
  getAllPostComments,
  createComment,
  updatePost,
  deleteFeedPost,
  getPostTimeDifference,
};
