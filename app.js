const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articleSchema);

//all articles
app
  .route("/articles")
  .get(async (req, res) => {
    try {
      const articles = await Article.find({});
      res.send(articles);
    } catch (err) {
      console.log(err);
    }
  })
  .post(async (req, res) => {
    try {
      const newArticle = new Article({
        title: req.body.title,
        content: req.body.content,
      });

      await newArticle.save();
      res.send("Successfully added a new article.");
    } catch (error) {
      res.send(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const deleted = await Article.deleteMany();
      res.send("Successfully deleted all articles");
    } catch (err) {
      console.log(err);
    }
  });
// specifi article
app
  .route("/articles/:articleTitle")
  .get(async (req, res) => {
    const foundArticle = await Article.findOne({
      title: req.params.articleTitle,
    });
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found.");
    }
  })
  .put(async (req, res) => {
    const updatedArticle = await Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    );
    if (updatedArticle) {
      res.send("Successfully updated article.");
    } else {
      res.send("No articles matching that title was found.");
    }
  })
  
  .delete(async (req, res) => {
    const deletedArticle = await Article.deleteOne({ title: req.params.articleTitle });
   
      if (deletedArticle) {
        res.send("Successfully deleted the corresponding article.");
      }
      else {
        res.send("No articles matching that title was found.");
      }

  })
  .patch(async (req, res) => {
    patchedArticle = await  Article.updateOne(
      { title: req.params.articleTitle },
      { $set: req.body });
    if(patchedArticle){
      res.send("Successfully updated article.");
    }else {
      res.send("No articles matching that title was found.");
    }

  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
