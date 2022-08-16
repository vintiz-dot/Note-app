"use strict";
const body = document.querySelector(".app-body");
const login = document.querySelector(".login-btn");
const signUp = document.getElementById("signup");
const userPage = document.getElementById("user-page");
const loginPage = document.getElementById("login-page");
const NewUser = document.getElementById("new-user");
const logOut = document.getElementById("log-out");
const noteHead = document.getElementById("note-head");
const noteBody = document.getElementById("note-body");
const overlay = document.querySelector(".overlay");
const privateContainer = document.getElementById("privateClass");
const editPost = document.getElementById("edit-post-btn");
let target;

// creating new user
class User {
  #password;
  #username;
  #notesContainer;
  #postId = 0;
  #id;
  constructor(username, password) {
    this.#username = username;
    this.#password = password;
    this.#id = +JSON.stringify(new Date().getTime()).slice(4, -1);
    this.#notesContainer = [];
  }
  get notes() {
    return this.#notesContainer;
  }
  get id() {
    return this.#id;
  }
  get username() {
    return this.#username;
  }
  _submitPost(post) {
    this.#notesContainer.push(post);
  }
  _postTime() {
    return `${new Date().toDateString()} at ${new Date().toLocaleTimeString()}`;
  }
  createPost(title, post) {
    // if (post === "" || title === "") {
    //   alert(`you can't create an empty post`);
    //   return;
    // }
    const newPost = {
      author: this.username,
      title: title,
      msg: post,
      postId: this.#postId,
      time: this._postTime(),
    };
    this.#postId += 1;
    this._submitPost(newPost);
    // return newPost;
  }

  findPost(postId) {
    return this.#notesContainer.find((post) => post.postId === postId);
  }

  deletePost(postId) {
    this.notes.splice(this.findPost(postId).pospostId, 1);
  }
}
let textDelete;
class App {
  #users = [];
  #activeUser;
  constructor() {
    this._loginUser();
    this.editpost();
    this.#deletePost();
  }
  _findUser(username) {
    return this.#users.filter((user) => user.username === username).length === 0
      ? alert(`NO USER FOUND`)
      : this.#users.filter((user) => user.username === username);
  }
  _initialize() {
    const landingPage = document.getElementById("signin-login");
    const username = document.getElementById("sign-inUsername").value;
    console.log("landing", landingPage);
    const password = document.getElementById("sign-inPassword").value;
    // const username = ""; //text content
    //
    // if (!_findUser(username)) {
    //   alert("user not found");
    //   return;
    // }
    // loginPage.classList.add("hidden");
    userPage.classList.remove("hidden");
    // this.#activeUser = this._findUser(username);
    this.#activeUser = this._findUser(username)[0];
    // introduce log out button again
    landingPage.remove();
    // console.clear();
    this._displayPosts();
    this._update();
  }

  _loginUser() {
    login.addEventListener("click", this._initialize.bind(this));
  }
  _logoutUser() {
    logOut.addEventListener("click", function (x) {
      this.#activeUser = null;
      logOut.remove();
    });
  }
  _addNewUser(user) {
    // this.#users.push(user);
    // let username; //text value
    // let password; //text value
    // if (isNaN(username) || username === undefined || username === null) return;
    // NewUser.addEventListener("click", function (x) {
    // const user = new User(username, password);
    this.#users.push(user);
    // });
  }
  _deletePost(x) {
    if (!x.target.classList.contains("delete-btn")) return;
    const deleteIndex = this.#activeUser.notes.findIndex((post) => {
      return post.postId === +x.target.previousElementSibling.id;
    });
    this.#activeUser.notes.splice(deleteIndex, 1);
    this._displayPosts();
  }
  #deletePost() {
    body.addEventListener("click", this._deletePost.bind(this));
  }

  _toggleHidden() {
    overlay.classList.toggle("hidden");
    privateContainer.classList.toggle("hidden");
  }

  _editPost_() {
    const newtext = document.getElementById("post-edit-msg").value;
    const newTitle = document.getElementById("new-title").value;
    this.#activeUser.notes[+target.id].msg = newtext;
    this.#activeUser.notes[+target.id].title = newTitle;
    this._toggleHidden();
    this._displayPosts();
  }
  _closeModal() {
    const closeModal = document.querySelector(".close-modal");
    closeModal.addEventListener("click", this._toggleHidden.bind(this));
  }
  _editPost(x) {
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

    btnSubmit.addEventListener("click", this._editPost_.bind(this));
  }

  editpost() {
    body.addEventListener("click", this._editPost.bind(this));
  }
  _update() {
    editPost.addEventListener("click", this._displayPosts.bind(this));
  }

  _getNotes() {
    this.#activeUser.notes.forEach((post) => {
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
      noteBody.insertAdjacentHTML("beforeend", html);
    });
  }
  randomNumber(max) {
    return Math.floor(Math.random() * max);
  }
  randomPost(list) {
    return list[this.randomNumber(list["length"])];
  }

  getjumbotron() {
    const post = this.randomPost(this.#activeUser.notes);
    if (post?.title === undefined) return;
    const html1 = `<div class="p-5 mb-4 bg-light rounded-3">
    <div class="container-fluid py-5">
      <h1 class="display-5 fw-bold">${post?.title}</h1>
      <p class=" fs-4">${post?.msg}
      </p>      
      </div>
    </div>`;
    html1 && noteHead.insertAdjacentHTML("beforeend", html1);
  }
  _clearnotes() {
    noteHead.innerHTML = "";
    noteBody.innerHTML = "";
  }
  _displayPosts() {
    this._clearnotes();
    this.getjumbotron();
    this._getNotes();
    if (this.#activeUser.notes.length === 0) {
      noteHead.insertAdjacentHTML(
        "beforeend",
        `<div class="p-5 mb-4 bg-light rounded-3">
      <div class="container-fluid py-5">
        <h1 class="display-5 fw-bold">No Posts <br> Create a New Post Now</h1>             
        </div>
      </div>`
      );
    }
  }
}

const app = new App();
const test = new User("username", "password");
app._addNewUser(test);

test.createPost(
  "1st The fundamentals of Js",
  `Long ass post. 1. Commonwealth Scholarships in the UK are funded by the UK Department for International Development (DFID). An important selection criterion is the potential contribution that you will make to international development if you are awarded a scholarship. Provide a Development Impact statement in 4 parts explaining:
1. How your proposed study relates to:
a) Development issues at the global, National and Local level:
b) Development issues connected to you chosen CSC theme and the wider sector? 

(200 words) but 236 (Need to cut down to 200)

`
);

test.createPost(
  "post 2",
  `As the world steers in the direction of sustainable development to end all forms of hunger and malnutrition by 2030, I am concerned that my country, Nigeria is lagging behind and may not be able to reach this goal by 2030 as it is faced with severe sustainability issues such as environmental degradation, drought and biodiversity losses. The need to address the challenges of food insecurity in recent times calls for the prompt implementation of effective and efficient sustainability measures. Generally, food is a vital need for survival. Hence, the agricultural industry plays an essential role in ensuring that such demand is met through promoting sustainable agriculture, supporting small-scale farmers and equal access to land, technology and markets. According to Food and Agriculture Organization, 9.6 million people in Nigeria faced worse levels of hunger and food losses account for one- third of global food production. Furthermore, this estimation of food insecurity is equivalent to 1.3 billion tons of food losses in the world. These statistics are saddening and therefore raise the moral question of injustice to the affected nations as many human beings, especially in Nigeria, are dying of hunger and malnutrition.`
);

test.createPost(
  "test post3",
  `To attain SDG 1, 2, and 13, the importance of carrying out cutting-edge researches in search of the optimal solution to the indefatigable problem of food insecurity cannot be overemphasized.
2. How you intend to apply your new skills and qualification when you return home? (100 words)
Research skills acquired during my Master’s program will be used to contribute extensively to literatures on food security by delving into critical issues such as human exploitation of the Earth’s resources, poverty alleviation, the ecological basis for sustainable agricultural development while incorporating risk and sustainability strategies. At the same time, a compromise will be made between environmentally sound solutions and risk reduction techniques. `
);

// const test1 = new User("towel", "pass");
// app._addNewUser(test1);
