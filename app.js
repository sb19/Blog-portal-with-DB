const express = require("express");

const bodyParser = require("body-parser");

const ejs = require("ejs");

const _ = require("lodash");

const mongoose = require("mongoose");
//mongodb atlas connection
mongoose.connect(
  "mongodb+srv://shubham:<password>@cluster0.3x7kg.mongodb.net/BlogsDB",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
//to access static files from "public" folder
app.use(express.static("public"));

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const Blog = mongoose.model("blog", blogSchema);

//starting route
app.get("/", (req, res) => {
  Blog.find(function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      //render home.ejs with homeStartingcontent data and blogs collection.
      res.render("home", { homeContent: homeStartingContent, posts: blogs });
    }
  });
});

//about route
app.get("/about", (req, res) => {
  res.render("about", { aboutContent: aboutContent });
});

//contact route
app.get("/contact", (req, res) => {
  res.render("contact", { contactContent: contactContent });
});

//for blog creation(publish)
app.get("/compose", (req, res) => {
  res.render("compose");
});

//to collect data from form and adding that data into posts array as an object which containing title and body of the blog(post).
app.post("/composs", (req, res) => {
  const blog = new Blog({
    title: req.body.postTitle,
    body: req.body.postBody,
  });
  blog.save(function (err) {
    if (!err) {
      //redirecting to starting route(home page)
      res.redirect("/");
    } else {
      res.send("error while saving blog data into db :" + err);
    }
  });
});

//with the help of blog id selecting the blog and fetching the blog title and body.
app.get("/posts/:postId", (req, res) => {
  //converting postname in lower case with the help of lodash(reference: https://lodash.com/)
  //const postName = _.lowerCase(req.params.postName);

  //iterating posts array
  //posts.forEach(function (post) {
  //const postTitle = _.lowerCase(post.postTitle);
  //const postTitle = _.lowerCase(post.title);
  //comparing the parameter with the existing posts title
  // if (postTitle === postName) {
  //   res.render("post", {
  //     postTitle: post.title,
  //     postBody: post.body,
  //   });
  // }
  //});

  const postId = req.params.postId;
  Blog.findById(postId, function (err, blog) {
    if (err) {
      res.send("error blog id not found : " + err);
    } else {
      res.render("post", {
        postTitle: blog.title,
        postBody: blog.body,
      });
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});
