"use strict";

const NewUser = document.getElementById("new-user");
const noteHead = document.getElementById("note-head");
const noteBody = document.getElementById("note-body");
const privateContainer = document.getElementById("privateClass");
const editPost = document.getElementById("edit-post-btn");
let target;

class User {
  #password;
  #username;
  notesContainer;
  #id;
  postId = 0;
  constructor(username, password) {
    this.#username = username;
    this.#password = password;
    this.#id = +JSON.stringify(new Date().getTime()).slice(4, -1);
    this.notesContainer = [];
    Object.defineProperty(this, "password", {
      enumerable: true,
      get: function () {
        return this.#password;
      },
    });

    Object.defineProperty(this, "username", {
      enumerable: true,
      get: function () {
        return this.#username;
      },
    });

    Object.defineProperty(this, "notes", {
      enumerable: true,
      get: function () {
        return this.notesContainer;
      },
    });

    Object.defineProperty(this, "id", {
      enumerable: true,
      get: function () {
        return this.#id;
      },
    });
  }
}

class App {
  #invalid_login = document.getElementById("invalid-id");
  #invalid = document.getElementById("invalid-id-");
  #login = document.querySelector(".login-btn");
  #overlay = document.querySelector(".overlay");
  #body = document.querySelector(".app-body");
  #logOutbtn = document.getElementById("log-out");
  #siginPage = document.getElementById("login-page");
  #signupPage = document.getElementById("sign-up-page");
  #userPage = document.getElementById("user-page");
  #signUp = document.getElementById("signup");
  #btnSubmit = document.getElementById("create-post-btn!");
  newPostWindow = document.getElementById("create-post-window");
  #landingPage = document.getElementById("signin-login");
  #navBar = document.getElementById("nav-bar");
  #users = [];
  #activeUserPost = [];
  #postEdit;
  #activeUser;

  constructor() {
    this.#updateUsers();
    this.#createPost();
    this.#loadSignupPage();
    this.#body.addEventListener("click", this.#editPost.bind(this));
    this.#body.addEventListener("click", this.#deletePost.bind(this));
    this.#logOutbtn.addEventListener("click", this.#logOut.bind(this));
    this.#login.addEventListener("click", this._initialize.bind(this));
    this.#signUp.addEventListener("click", this._addNewUser.bind(this));
    this.#btnSubmit.addEventListener("click", this._createPost_.bind(this));
  }

  /***************************BEGINNING OF MAIN FUNCTIONS*************************** */

  _addNewUser(x) {
    x.preventDefault();

    // collect entires
    const username = document.getElementById("Signup-username");
    const password = document.getElementById("SignupPassword");

    // gaurd for valid inputs
    if (
      username.value === "" ||
      username.value === undefined ||
      username.value === null ||
      password.value.length < 7
    ) {
      this.#invalidMsg("invalid entries");
      return;
    }

    // reserved username
    if (username.value.toLowerCase() === "towel") {
      this.#invalidMsg(`Boss that username is reserved 😂😂😂😂`);
      username.value = password.value = "";
      return;
    }

    // check for existing username
    if (this._findUser(username.value)) {
      this.#invalidMsg(`Username already exists`);
      return;
    }

    // initialize user and setup display
    const user = new User(username.value, password.value);
    this.#users.push(user);
    this.#activeUser = user;
    this.#setupDisplay();
    username.value = password.value = this.#invalid.innerHTML = "";
    this.#displayPosts();

    // update local storage
    localStorage.setItem("users", [JSON.stringify(this.#users)]);
  }

  /************************END OF THE CREATE NEW USER************************* */

  _initialize(c) {
    c.preventDefault();

    const username = document.getElementById("sign-inUsername");
    const password = document.getElementById("sign-inPassword");

    this.#invalid_login?.classList.add("hidden");
    const user = this._findUser(username.value);

    //check if the username exists
    if (!user) {
      this.#invalid_login.classList.remove("hidden");
      username.value = password.value = "";
      return;
    }

    // check if the username and pass words match
    if (user.password !== password.value) {
      this.#invalid_login.classList.remove("hidden");
      username.value = password.value = " ";
      return;
    }

    // logged in, setup display

    username.value = password.value = "";
    this.#activeUser = user;
    this.#setupDisplay();
    this.#rebuildOldPosts();
    this.#displayPosts();
  }

  // *********************END OF INITIALIZE METHOD****************************//

  #logOut() {
    // deactivate the active user
    this.#activeUser = null;
    this.#activeUserPost = [];
    this._clearnotes();

    // turn off the display
    this.#navBar.classList.add("hidden");
    this.#landingPage.classList.remove("hidden");
    this.#siginPage.classList.remove("hidden");
    this.#signupPage.classList.add("hidden");
    this.#invalid.classList.add("hidden");
  }

  // **************************END OF LOGOUT METHOD*************************** //

  #updateUsers() {
    const users = JSON.parse(localStorage.getItem("users"));
    if (!users) return;
    users.forEach((user) => this.#users.push(user));
  }
  //****************END OF UPDATE USERS******************************** */

  #createNewPost(title, post) {
    if (post === "" || title === "") return;

    const newPost = {
      author: this.#activeUser.username,
      title: title,
      msg: post,
      time: this.#setPostTime(),
      postId: this.#activeUser.postId,
    };
    this.#activeUser.postId += 1;
    this.#submitPost(newPost);

    return newPost;
  }

  /* *************************END OF CREATE NEW POST************************** */

  #submitPost(post) {
    this.#activeUserPost.push(post);
    this.#activeUser.notesContainer.push(post);
    localStorage.setItem(
      this.#activeUser.username,
      JSON.stringify(this.#activeUserPost)
    );
  }
  /* ***************END OF SUBMIT POST****************************** */

  #rebuildOldPosts() {
    const data = JSON.parse(localStorage.getItem(this.#activeUser.username));
    if (!data) return;
    data.forEach((postObj) => this.#activeUserPost.push(postObj));
  }

  /*******************END OF THE REBUILD OLD POST******************* */

  #editPost(x) {
    this._closeModal();
    if (!x.target.classList.contains("edit-btn")) return;
    target = x.target;
    const btnSubmit = document.getElementById("edit-post-btn");
    this._toggleHidden();
    privateContainer.scrollIntoView({
      block: "center",
      behavior: "auto",
      inline: "start",
    });
    this._clearValues();
    this.#postEdit = this.#findPost(+target.id);
    const newtext = document.getElementById("post-edit-msg");
    const newTitle = document.getElementById("new-title");
    newTitle.value = this.#postEdit.title;
    newtext.value = this.#postEdit.msg;
    btnSubmit.addEventListener("click", this._editPost_.bind(this));
  }

  // *************************END OF EDIT POST*************************//

  #deletePost(x) {
    if (!x.target.classList.contains("delete-btn")) return;
    const deleteIndex = this.#activeUserPost.findIndex((post) => {
      return post.postId === +x.target.previousElementSibling.id;
    });
    this.#activeUserPost.splice(deleteIndex, 1);
    localStorage.setItem(
      this.#activeUser.username,
      JSON.stringify(this.#activeUserPost)
    );
    this.#displayPosts();
  }
  // ***************END OF DELETE POST METHOD************************
  /**   *   *
   *
   *
   * =================>END OF MAIN FUNCTIONS<========================
   *   *
   *
   */

  /*********************BEGINNING OF HELPER FUNCTIONS********************* */
  #setPostTime() {
    return `${new Date().toDateString()} at ${new Date().toLocaleTimeString()}`;
  }

  #setupDisplay() {
    this.#landingPage.classList.add("hidden");
    this.#userPage.classList.remove("hidden");
    this.#navBar.classList.remove("hidden");
  }

  #findPost(postId) {
    return this.#activeUserPost.find((post) => post.postId === postId);
  }

  //change to find and not filter
  _findUser(username) {
    return this.#users.find((user) => user.username === username);
  }

  #loadSignupPage() {
    const btnSignUp = document.getElementById("offer-sign-up");
    btnSignUp.addEventListener("click", this._loadSignUP.bind(this));
  }

  _loadSignUP(x) {
    x.preventDefault();
    this.#siginPage.classList.add("hidden");
    this.#signupPage.classList.remove("hidden");
  }

  // CREATE POST HELPER FUNCTIONS

  #createPost() {
    this.#closeModalCreatePost();
    const newPostbtn = document.getElementById("create-post!");
    newPostbtn.addEventListener("click", this._createPost.bind(this));
  }

  _createPost_(x) {
    x.preventDefault();
    let newtext = document.getElementById("post-create-msg").value;
    let newTitle = document.getElementById("create-title").value;
    this.#createNewPost(newTitle, newtext);
    this.#displayPosts("afterbegin");
    this.newPostWindow.classList.add("hidden");
    this.#overlay.classList.add("hidden");
    newtext = "";
    newTitle = "";
    return;
  }

  _createPost(x) {
    x.preventDefault();
    this._clearValues();
    this.newPostWindow.classList.remove("hidden");
    this.#overlay.classList.remove("hidden");
    this.newPostWindow.scrollIntoView({
      block: "center",
      behavior: "auto",
      inline: "start",
    });
  }

  #closeModalCreatePost() {
    const modal = document.getElementById("close-create-modal");
    modal.addEventListener("click", this.#closewindow.bind(this));
  }

  //END OF CREATE POST HELPER FUNCTIONS

  #closewindow(x) {
    x.preventDefault();

    this.newPostWindow.classList.add("hidden");
    this.#overlay.classList.add("hidden");
  }

  _clearValues() {
    document.getElementById("post-create-msg").value = "";
    document.getElementById("create-title").value = "";
  }

  #invalidMsg(msg) {
    this.#invalid.innerHTML = "";
    this.#invalid.classList.remove("hidden");
    this.#invalid.insertAdjacentText("beforeend", msg);
  }

  _editPost_() {
    const newtext = document.getElementById("post-edit-msg");
    const newTitle = document.getElementById("new-title");
    this.#postEdit.msg = newtext.value;
    this.#postEdit.title = newTitle.value;
    this.#overlay.classList.add("hidden");
    privateContainer.classList.add("hidden");
    this.#displayPosts();
  }

  _closeModal() {
    const closeModal = document.querySelector(".close-modal");
    closeModal.addEventListener("click", this._toggleHidden.bind(this));
  }

  _clearnotes() {
    noteHead.innerHTML = "";
    noteBody.innerHTML = "";
  }

  _toggleHidden() {
    this.#overlay.classList.toggle("hidden");
    privateContainer.classList.toggle("hidden");
  }

  randomNumber(max) {
    return Math.floor(Math.random() * max);
  }
  randomPost(list) {
    return list[this.randomNumber(list["length"])];
  }

  getjumbotron() {
    const post = this.randomPost(this.#activeUserPost);
    if (post?.title === undefined) return;
    const html = `<div class="p-5 mb-4 bg-light rounded-3">
    <div class="container-fluid py-5">
      <h1 class="display-5 fw-bold">${post?.title}</h1>
      <p class=" fs-4">${post?.msg}
      </p>      
      </div>
    </div>`;
    html && noteHead.insertAdjacentHTML("beforeend", html);
  }

  #displayPosts(where = "beforeend") {
    this._clearnotes();
    this.getjumbotron();
    this._getNotes(where);
    if (this.#activeUserPost.length === 0) {
      noteHead.insertAdjacentHTML(
        where,
        `<div class="p-5 mb-4 bg-light rounded-3">
      <div class="container-fluid py-5">
        <h1 style="
        font-size: 36px;
        color: #5fcf80;
        font-weight: 600;
        font-family: Poppins, sans-serif;"
       class="display-5 fw-bold">No Posts <br> Create a New Post Now</h1>             
        </div>
      </div>`
      );
    }
  }

  _getNotes(where) {
    this.#activeUserPost.forEach((post) => {
      let html = `<div  class="col-md-6" style="padding-top: 40px;">
                  <div class="h-100 p-5 text-dark bg-light rounded-3">
                      <h2>${post.title}</h2>
                      <p>${post.msg}</p>
                      <br><br>
                      <p>Created by
                      ${post.author} on ${post.time}.
                      </p>
                      <button class="edit-btn btn btn-outline-dark" id="${post.postId}" type="button">
                      Edit Post
                      </button>
                      <button class="delete-btn btn btn-outline-dark" type="button">
                      Delete Post
                      </button>
                  </div>
                </div>`;
      noteBody.insertAdjacentHTML(where, html);
    });
  }
}
const app = new App();
