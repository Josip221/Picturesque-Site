import { createComment } from "./api.js";
import { modalShowComments } from "./modal.js";

const inputOnSubmit = (button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
    const neighInput = button.previousElementSibling;
    submitValue(neighInput);
  });
  button.addEventListener("touchstart", (e) => {
    e.preventDefault();
    const neighInput = button.previousElementSibling;
    submitValue(neighInput);
  });
};

const inputOnEnterPress = (input) => {
  const neighButton = input.nextElementSibling;
  input.addEventListener("input", (e) => toggleDisabledButton(e, neighButton));
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submitValue(input);
    }
  });
};

const toggleDisabledButton = (e, neighButton) => {
  if (e.target.value.length > 0) {
    neighButton.removeAttribute("disabled");
  }
};

const submitValue = (input) => {
  const neighButton = input.nextElementSibling;
  neighButton.setAttribute("disabled", true);
  const post_id =
    input.parentNode.parentNode.dataset.post_id ||
    window.location.href.split("/Seminar/")[1];
  createComment(input.value, post_id)
    .then((res) => {
      if (window.location.href.split("/Seminar/")[1]) {
        modalShowComments(post_id);
      }
      input.value = "";
    })
    .catch((err) => {
      console.log(err);
      input.value = "";
    });
};

export { inputOnSubmit, inputOnEnterPress };
