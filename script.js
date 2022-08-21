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
// let username;
// let password;
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
  #findPost(postId) {
    return this.#activeUserPost.find((post) => post.postId === postId);
  }
  #setPostTime() {
    return `${new Date().toDateString()} at ${new Date().toLocaleTimeString()}`;
  }
  #submitPost(post) {
    this.#activeUserPost.push(post);
    this.#activeUser.notesContainer.push(post);
    localStorage.setItem(
      this.#activeUser.username,
      JSON.stringify(this.#activeUserPost)
    );
  }

  #updateUsers() {
    const users = JSON.parse(localStorage.getItem("users"));
    if (!users) return;
    users.forEach((user) => this.#users.push(user));
  }
  _findUser(username) {
    return this.#users.filter((user) => user.username === username).length === 0
      ? false
      : this.#users.filter((user) => user.username === username);
  }

  #rebuildOldPosts() {
    const data = JSON.parse(localStorage.getItem(this.#activeUser.username));
    if (!data) return;
    data.forEach((postObj) => this.#activeUserPost.push(postObj));
  }
  #setupDisplay() {
    this.#landingPage.classList.add("hidden");
    this.#userPage.classList.remove("hidden");
    this.#navBar.classList.remove("hidden");
  }

  _initialize(c) {
    c.preventDefault();

    const username = document.getElementById("sign-inUsername");
    const password = document.getElementById("sign-inPassword");

    this.#invalid_login?.classList.add("hidden");

    //check if the username exists
    if (!this._findUser(username.value)) {
      this.#invalid_login.classList.remove("hidden");
      username = password = "";
      return;
    }

    const user = this._findUser(username.value)[0];

    // check if the username and pass words match
    if (user.password != password.value) {
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

  #loadSignupPage() {
    const btnSignUp = document.getElementById("offer-sign-up");
    btnSignUp.addEventListener("click", this._loadSignUP.bind(this));
  }
  _loadSignUP(x) {
    x.preventDefault();
    this.#siginPage.classList.add("hidden");
    this.#signupPage.classList.remove("hidden");
  }
  #invalidMsg(msg) {
    this.#invalid.innerHTML = "";
    this.#invalid.classList.remove("hidden");
    this.#invalid.insertAdjacentText("beforeend", msg);
  }

  _addNewUser(x) {
    x.preventDefault();

    // collect entires
    username = document.getElementById("Signup-username").value;
    password = document.getElementById("SignupPassword").value;

    // gaurd for valid inputs
    if (
      username === NaN ||
      username === undefined ||
      username === null ||
      password.length < 7
    ) {
      this.#invalidMsg("invaid entries");
      return;
    }

    // reserved username
    if (username.toLowerCase() === "towel") {
      this.#invalidMsg(`Boss that username is reserved 😂😂😂😂`);
      return;
    }

    // check for existing username
    if (this._findUser(username)) {
      this.#invalidMsg(`Username already exists`);
      return;
    }

    // initialize user and setup display
    const user = new User(username, password);
    this.#users.push(user);
    this.#activeUser = user;
    this.#setupDisplay();
    username = password = this.#invalid.innerHTML = "";
    this.#displayPosts();

    // update local storage
    localStorage.setItem("users", [JSON.stringify(this.#users)]);
  }

  #closeModalCreatePost() {
    const modal = document.getElementById("close-create-modal");
    modal.addEventListener("click", function (x) {
      x.preventDefault();
      const newPostWindow = document.getElementById("create-post-window");
      newPostWindow.classList.add("hidden");
      this.#overlay.classList.add("hidden");
    });
  }
  #createPost() {
    this.#closeModalCreatePost();
    const newPostbtn = document.getElementById("create-post!");
    newPostbtn.addEventListener("click", this._createPost.bind(this));
  }
  _clearValues() {
    document.getElementById("post-create-msg").value = "";
    document.getElementById("create-title").value = "";
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

  #deletePost(x) {
    if (!x.target.classList.contains("delete-btn")) return;
    const deleteIndex = this.#activeUserPost.findIndex((post) => {
      return post.postId === +x.target.previousElementSibling.id;
    });
    this.#activeUser.notes.splice(deleteIndex, 1);
    this.#displayPosts();
  }

  _toggleHidden() {
    this.#overlay.classList.toggle("hidden");
    privateContainer.classList.toggle("hidden");
  }

  _editPost_() {
    const newtext = document.getElementById("post-edit-msg").value;
    const newTitle = document.getElementById("new-title").value;
    this.#activeUser.notes[+target.id].msg = newtext;
    this.#activeUser.notes[+target.id].title = newTitle;
    this.#overlay.classList.add("hidden");
    privateContainer.classList.add("hidden");
    this.#displayPosts();
  }
  _closeModal() {
    const closeModal = document.querySelector(".close-modal");
    closeModal.addEventListener("click", this._toggleHidden.bind(this));
  }
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
    btnSubmit.addEventListener("click", this._editPost_.bind(this));
  }

  _getNotes(where) {
    this.#activeUserPost.forEach((post) => {
      let html = `<div  class="col-md-6" style="padding-top: 40px;">
                  <div class="h-100 p-5 text-white bg-dark rounded-3">
                      <h2>${post.title}</h2>
                      <p>${post.msg}</p>
                      <br><br>
                      <p>Created by
                      ${post.author} on ${post.time}.
                      </p>
                      <button class="edit-btn btn btn-outline-light" id="${post.postId}" type="button">
                      Edit Post
                      </button>
                      <button class="delete-btn btn btn-outline-light" type="button">
                      Delete Post
                      </button>
                  </div>
                </div>`;
      noteBody.insertAdjacentHTML(where, html);
    });
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
  _clearnotes() {
    noteHead.innerHTML = "";
    noteBody.innerHTML = "";
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
}

const app = new App();
// const test = new User("username", "password");
// app._addNewUser(test);

// test.createPost(
//   "1st The fundamentals of Js",
//   `Long ass post. 1. Commonwealth Scholarships in the UK are funded by the UK Department for International Development (DFID). An important selection criterion is the potential contribution that you will make to international development if you are awarded a scholarship. Provide a Development Impact statement in 4 parts explaining:
// 1. How your proposed study relates to:
// a) Development issues at the global, National and Local level:
// b) Development issues connected to you chosen CSC theme and the wider sector?

// (200 words) but 236 (Need to cut down to 200)

// `
// );

// test.createPost(
//   "post 2",
//   `As the world steers in the direction of sustainable development to end all forms of hunger and malnutrition by 2030, I am concerned that my country, Nigeria is lagging behind and may not be able to reach this goal by 2030 as it is faced with severe sustainability issues such as environmental degradation, drought and biodiversity losses. The need to address the challenges of food insecurity in recent times calls for the prompt implementation of effective and efficient sustainability measures. Generally, food is a vital need for survival. Hence, the agricultural industry plays an essential role in ensuring that such demand is met through promoting sustainable agriculture, supporting small-scale farmers and equal access to land, technology and markets. According to Food and Agriculture Organization, 9.6 million people in Nigeria faced worse levels of hunger and food losses account for one- third of global food production. Furthermore, this estimation of food insecurity is equivalent to 1.3 billion tons of food losses in the world. These statistics are saddening and therefore raise the moral question of injustice to the affected nations as many human beings, especially in Nigeria, are dying of hunger and malnutrition.`
// );

// test.createPost(
//   "test post3",
//   `To attain SDG 1, 2, and 13, the importance of carrying out cutting-edge researches in search of the optimal solution to the indefatigable problem of food insecurity cannot be overemphasized.
// 2. How you intend to apply your new skills and qualification when you return home? (100 words)
// Research skills acquired during my Master’s program will be used to contribute extensively to literatures on food security by delving into critical issues such as human exploitation of the Earth’s resources, poverty alleviation, the ecological basis for sustainable agricultural development while incorporating risk and sustainability strategies. At the same time, a compromise will be made between environmentally sound solutions and risk reduction techniques. `
// );

// const test1 = new User("towel", "pass");
// app._addNewUser(test1);
