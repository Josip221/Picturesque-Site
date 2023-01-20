import { updatePost, deleteFeedPost } from "./api.js";

const heartIconEventListener = (icon) => {
  icon.addEventListener("mouseleave", () => {
    if (icon.classList.contains("fa-regular")) {
      icon.style.animation = "none";
      setTimeout(() => {
        icon.style.animation = "hoverOffIcon 0.3s";
      }, 0);
    }
  });

  //hearts
  icon.addEventListener("click", async (e) => {
    const post = icon.closest(".feed__item");
    const modal = icon.closest("#modal__content");
    const { isLiked, likeAmount, isBookmarked, post_id } =
      post?.dataset || modal?.dataset;

    const data = {
      isLiked: +isLiked,
      likeAmount: +likeAmount,
      isBookmarked,
      post_id: +post_id,
    };

    if (data.isLiked == 0 || data.isLiked == false) {
      data.isLiked = 1;
      data.likeAmount++;
    } else {
      data.isLiked = 0;
      data.likeAmount--;
    }
    if (post) {
      changePostLikes(post, data.likeAmount);
      updatePostDataset(post, data.isLiked, data.likeAmount, data.isBookmarked);
    }
    if (modal) {
      changeModalLikes(modal, data.likeAmount, data.post_id);
      updateModalDataset(
        modal,
        data.isLiked,
        data.likeAmount,
        data.isBookmarked
      );
    }
    try {
      await updatePost(data);
    } catch (error) {
      console.log(error);
    }
  });
};

const changePostLikes = (post, num) => {
  const likeBox = post.querySelector(".likes1");
  const heartIcon = post.querySelector(".fa-heart");
  heartIcon.classList.toggle("fa-regular");
  heartIcon.classList.toggle("fa-solid");
  likeBox.textContent = `${num} likes`;
};

const changeModalLikes = (modal, num, post_id) => {
  const posts = [...document.querySelectorAll(".feed__item")];
  const filteredPosts = posts.filter(
    (post) => +post.dataset.post_id === post_id
  );
  changePostLikes(...filteredPosts, num);
  console.log(...filteredPosts);
  const likeBox = modal.querySelector(".likes2");
  likeBox.textContent = `${num} likes`;

  const heartIcon = modal.querySelector(".fa-heart");
  heartIcon.classList.toggle("fa-regular");
  heartIcon.classList.toggle("fa-solid");
};

const bookmarkEventListener = (icon) => {
  icon.addEventListener("click", async (e) => {
    const post = icon.closest(".feed__item");
    const modal = icon.closest("#modal__content");
    const { isLiked, likeAmount, isBookmarked, post_id } =
      post?.dataset || modal?.dataset;
    const data = {
      isLiked: +isLiked,
      likeAmount: +likeAmount,
      post_id: +post_id,
      isBookmarked: +isBookmarked,
    };
    if (
      data.isBookmarked == 0 ||
      data.isBookmarked == "false" ||
      data.isBookmarked == false
    )
      data.isBookmarked = 1;
    else if (
      data.isBookmarked == 1 ||
      data.isBookmarked == "true" ||
      data.isBookmarked == true
    ) {
      data.isBookmarked = 0;
    }

    icon.classList.toggle("fa-regular");
    icon.classList.toggle("fa-solid");
    if (post) {
      updatePostDataset(post, isLiked, likeAmount, data.isBookmarked);
    }
    if (modal) {
      updateModalDataset(modal, isLiked, likeAmount, data.isBookmarked);
    }

    try {
      await updatePost(data);
    } catch (error) {
      console.log(error);
    }
  });
};

const updatePostDataset = (post, isLiked, likeAmount, isBookmarked) => {
  post.dataset.isLiked = isLiked;
  post.dataset.likeAmount = likeAmount;
  post.dataset.isBookmarked = isBookmarked;
};
const updateModalDataset = (modal, isLiked, likeAmount, isBookmarked) => {
  modal.dataset.isLiked = isLiked;
  modal.dataset.likeAmount = likeAmount;
  modal.dataset.isBookmarked = isBookmarked;
};

const optionsIconEventListener = (icon) => {
  icon.addEventListener("click", async (e) => {
    const post = e.target.closest(".feed__item");
    await deleteFeedPost(post.dataset.post_id);
    post.remove();
  });
};

export {
  heartIconEventListener,
  bookmarkEventListener,
  optionsIconEventListener,
};
