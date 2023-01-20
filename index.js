import { modalShowForm, modalShowPost } from "./js/modal.js";
import {
  bookmarkEventListener,
  heartIconEventListener,
  optionsIconEventListener,
} from "./js/icons.js";
import { inputOnSubmit, inputOnEnterPress } from "./js/input.js";
import { getAllFeedPosts, getPostTimeDifference } from "./js/api.js";

const nav = document.getElementById("nav");
const user = document.getElementById("user");
const feed = document.getElementById("feed");

const navbar = document.createElement("nav");
navbar.role = "navigation";
navbar.className = "nav__container";
navbar.innerHTML = `
  <input class="nav__checkbox" type="checkbox" />
  <span></span>
  <span></span>
  <span></span>
  <ul class="nav__menu">
    <button id="logo">Picturesque</button>
    <button id="home" class="nav__link nav__link--active" >
      <i class="fa-solid fa-house"></i>Home 
    </button>
    <button id="create" class="nav__link" >
      <i class="fa-regular fa-square-plus"></i> Create post
    </button>
    <button id="logout" class="nav__link nav__link--last " >
      <i class="fa-solid fa-right-from-bracket"></i> Log out
    </button>
  </ul>
  
  `;

nav.appendChild(navbar);

const homeLink = document.getElementById("home");
const logoLink = document.getElementById("logo");
homeLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo(0, 0);
});

logoLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.scrollTo(0, 0);
});

const create = document.getElementById("create");
create.addEventListener("click", async (e) => {
  e.preventDefault();
  modalShowForm();
});

const logout = document.getElementById("logout");
logout.addEventListener("click", (e) => {
  alert("User functionality does not exist yet...");
});

//main feed
window.addEventListener("DOMContentLoaded", async () => loadFeedPosts(feed));

const loadFeedPosts = async (feed) => {
  try {
    contentLoading(feed);
    const data = await getAllFeedPosts();
    const res = await data.json();
    addPostsToFeed(res, feed);
  } catch (error) {
    console.log(error);
  }
};

const addPostsToFeed = (newPostsData) => {
  feed.innerHTML = "";
  if (newPostsData.length > 0) {
    newPostsData.forEach((newPostData) => {
      feed.appendChild(createPost(newPostData));
    });
  } else {
    feed.innerHTML = `<h2 class="feed__title">No posts to show</h2>`;
  }

  const posts = document.querySelectorAll(".feed__item");
  posts.forEach((post) => addEventListenersToPost(post));
};

const createPost = (newPostData) => {
  const {
    username,
    img,
    description,
    post_id,
    likeAmount,
    isLiked,
    isBookmarked,
    time,
  } = newPostData;

  const newTime = getPostTimeDifference(time);

  const newPost = document.createElement("div");
  newPost.dataset.user = username;
  newPost.dataset.img = img;
  newPost.dataset.post_id = post_id;
  newPost.dataset.likeAmount = likeAmount;
  newPost.dataset.isLiked = isLiked;
  newPost.dataset.isBookmarked = isBookmarked;
  newPost.dataset.description = description;
  newPost.dataset.time = newTime;
  newPost.className = "feed__item";
  newPost.innerHTML = `
    <div class="feed__header">
      <img class="feed__avatar" src="./avatar.jpg" />
      <span class="feed__header__username">${username}</span>
      <span style="flex-grow: 1; text-align: right">
        <button class="feed__dropdown__button">
          <i  class="fa-solid fa-ellipsis"></i>
        </button>
        <ul class="feed__dropdown">
          <li>
            <button>
            Delete post
            </button>
          </li>
        </ul>
      </span>
    </div>
    <img class="feed__image" src="${img}" alt="not available" />
    <div class="feed__footer">
      <div class="feed__icons">
        <div style="display: flex; gap: 0.5em">
          <button class="feed__button">
            <i class=" ${
              isLiked ? "fa-solid" : "fa-regular"
            } fa-heart fa-xl"></i>
          </button>
          <button class="feed__button">
            <i class="fa-regular fa-comment fa-xl fa-flip-horizontal"></i>
          </button>
        </div>
        <div>
          <button class="feed__button feed__icons__bookmark">
            <i class="${
              isBookmarked ? "fa-solid" : "fa-regular"
            } fa-bookmark fa-xl" ></i>
          </button>
        </div>
      </div>
      <div class="likes1">${likeAmount} likes
      </div>
      <div>
        <span>${username}</span>
        <p class="feed__description">${description}</p>
      </div>
      <div class="feed__date">
        ${newTime}
      </div>
    </div>
    <div class="feed__comment">
      <input type="text" class="feed__input" placeholder="Add a comment..."/>
      <button disabled class="feed__comment__button">Post</button>
    </div>`;
  return newPost;
};

// User
const userHeader = document.createElement("div");
userHeader.className = "user__header";
userHeader.innerHTML = `
    <div class="user__avatar__container">
      <img class="user__avatar" src="./avatar.jpg" alt="photo"/>
    </div>
    `;

const userInfo = document.createElement("div");
userInfo.className = "user__info";
userInfo.innerHTML = `
  Currently logged in as Admin
  `;
user.appendChild(userHeader);
user.appendChild(userInfo);

const addEventListenersToPost = (post) => {
  //open modal handler
  post.addEventListener("click", (e) => {
    if (
      e.target.className === "feed__image" ||
      e.target.classList.contains("fa-comment")
    ) {
      modalShowPost({
        username: post.dataset.user,
        img: post.dataset.img,
        post_id: post.dataset.post_id,
        isLiked: post.dataset.isLiked,
        likeAmount: post.dataset.likeAmount,
        isBookmarked: post.dataset.isBookmarked,
        description: post.dataset.description,
        time: post.dataset.time,
      });
    }
  });

  // icon handlers
  const heartIcons = post.querySelectorAll(".fa-heart");
  heartIcons.forEach((icon) => heartIconEventListener(icon));
  const bookmarkIcons = post.querySelectorAll(".fa-bookmark");
  bookmarkIcons.forEach((icon) => bookmarkEventListener(icon));
  const dropdowns = post.querySelectorAll(".feed__dropdown");
  dropdowns.forEach((icon) => optionsIconEventListener(icon));

  //input handlers
  const feedPostButtons = post.querySelectorAll(".feed__comment__button");
  feedPostButtons.forEach((button) => inputOnSubmit(button));
  const feedInputs = post.querySelectorAll(".feed__input");
  feedInputs.forEach((input) => inputOnEnterPress(input));
};

const contentLoading = (element) => {
  element.innerHTML = `<h2 class="feed__title">Loading content...</h2>`;
};

export { loadFeedPosts };
