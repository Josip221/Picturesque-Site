import { inputOnEnterPress, inputOnSubmit } from "./input.js";
import {
  getAllPostComments,
  getPostTimeDifference,
  createFeedPost,
} from "./api.js";
import { loadFeedPosts } from "../index.js";

const modalContent = document.getElementById("modal__content");
const modal = document.getElementById("modal");
const formContent = document.createElement("div");
formContent.className = "form__content";

window.addEventListener("keydown", (e) => {
  if (e.key == "Escape" && modal.style.display === "flex") {
    modal.style.display = "none";
    modalContent.style.display = "grid";
    emptyModalContent();
  }
});

window.addEventListener("click", (event) => {
  if (event.target == modal) {
    modal.style.display = "none";
    modalContent.style.display = "grid";
    emptyModalContent();
  }
});

const modalShowPost = async (data) => {
  const {
    username,
    img,
    post_id,
    isLiked,
    likeAmount,
    isBookmarked,
    description,
    time,
  } = data;
  formContent.style.display = "none";
  modalContent.dataset.isLiked = isLiked;
  modalContent.dataset.likeAmount = likeAmount;
  modalContent.dataset.isBookmarked = isBookmarked;
  modalContent.dataset.post_id = post_id;
  modalContent.dataset.description = description;
  modal.style.display = "flex";

  history.replaceState(
    {},
    null,
    `http://pzi.fesb.hr/MareticJ/Seminar/${post_id}`
  );

  const picture = document.createElement("div");
  picture.className = "modal__picture__container";
  picture.innerHTML = `
	<img class="modal__picture" src="${img}"/>
  `;

  const info = document.createElement("div");
  info.className = "modal__info";
  info.innerHTML = `
	<div class="modal__info__header">
		<img class="modal__info__avatar" src="./avatar.jpg" />
		${username}
	</div>
	<div class="modal__comments"></div>
    <div class="modal__footer">
      <div ><span>${username}</span> <p class="modal__description">${description}</p></div>
      <div class="modal__timestamp" style="align-self: flex-start; margin-left: 0;">${time}</div>
      <div class="modal__input__container">
      <input type="text" class="modal__input" placeholder="Add a comment..."/>
      <button disabled class="modal__comment__button">Post</button>
    </div>
	</div>
  `;

  modalContent.appendChild(picture);
  modalContent.appendChild(info);

  const input = modal.querySelector(".modal__input");
  const inputButton = modal.querySelector(".modal__comment__button");
  inputOnEnterPress(input);
  inputOnSubmit(inputButton);

  modalShowComments(post_id);
};

const emptyModalContent = () => {
  modalContent.innerHTML = "";
  history.replaceState({}, null, `http://pzi.fesb.hr/MareticJ/Seminar/`);
};

const modalShowComments = async (post_id) => {
  const commentsContainer = document.querySelector(".modal__comments");
  const getComments = await getAllPostComments();
  const commentsUnfiltered = await getComments.json();
  const commentsFiltered = commentsUnfiltered.filter(
    (comment) => comment.post_id == post_id
  );
  commentsContainer.innerHTML = "";
  commentsFiltered.forEach((commentData) => {
    const time = getPostTimeDifference(commentData.time);
    const newComment = document.createElement("div");
    newComment.className = "modal__comment";
    newComment.innerHTML = `
		<img class="modal__info__avatar" src="./avatar.jpg" />
		<div>
			<span class="modal__username">admin</span> 
			<p class="modal__comment__text">${commentData.message}</p>
		</div>
		<div class="modal__timestamp">
			${time}
		</div>
	`;
    commentsContainer.appendChild(newComment);
  });
};

const modalShowForm = () => {
  modal.style.display = "flex";
  modalContent.style.display = "none";

  formContent.style.display = "flex";
  formContent.innerHTML = "";
  formContent.innerHTML = `
    <div class="form__title">
      Create post
    </div>
    <div class="form__description">
      Provide an image address and a description
    </div>
    <div class="form__input__container">
      <input id="formImg" class="form__input" placeholder="Image url"/>
      <input id="formDescription" class="form__input" placeholder="Description"/>
     
    </div>
    <div class="form__footer">
      <button disabled class="form__button">Post</button>
    </div>
  `;
  modal.appendChild(formContent);

  const formImg = document.getElementById("formImg");
  const formDescription = document.getElementById("formDescription");

  const formButton = document.querySelector(".form__button");

  formButton.addEventListener("click", (e) => {
    e.preventDefault();
    const data = {
      img: formImg.value,
      description: formDescription.value,
      user_id: 1, //hardcoded admin id
    };
    createFeedPost(data)
      .then((res) => {
        formImg.value = "";
        formDescription.value = "";
        modal.style.display = "none";
        modalContent.style.display = "grid";
        loadFeedPosts(document.getElementById("feed"));
      })
      .catch((err) => console.log(err));
  });

  formImg.addEventListener("input", (e) => {
    checkFormsHaveValue();
  });

  formDescription.addEventListener("input", (e) => {
    checkFormsHaveValue();
  });

  const checkFormsHaveValue = () => {
    if (formImg.value.length > 0 && formDescription.value.length > 0) {
      formButton.disabled = false;
    } else {
      formButton.disabled = true;
    }
  };
};

export { modalShowPost, modalShowComments, modalShowForm };
