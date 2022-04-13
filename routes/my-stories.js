var express = require("express");
var router = express.Router();

const db = require("../db/models");
const { requireAuth } = require("../auth");
const { csrfProtection, asyncHandler } = require("./utils");
const { storyValidators } = require("./validators");
const { validationResult } = require("express-validator");

router.get("/my-stories/new", csrfProtection, (req, res) => {
  const story = db.Story.build({});
  res.render("new-story", { story, csrfToken: req.csrfToken() });
});

// NEED:
// requireAuth
// userId when logged in
router.post(
  "/my-stories/new",
  csrfProtection,
  storyValidators,
  asyncHandler(async (req, res, next) => {
    const { title, article, tag } = req.body;
    const story = db.Story.build({
      title,
      article,
    });
    const validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) {
      let tagId;
      const tagExists = await db.Tag.findOne({
        where: { name: tag },
      });
      if (tagExists) {
        tagId = tagExists.id;
      } else {
        const newTag = await db.Tag.create({
          name: tag,
        });
        tagId = newTag.id;
      }
      //temporary
      const userId = 1;
      const state = "published";

      story.tagId = tagId;
      story.userId = userId;
      story.state = state;

      await story.save();
      console.log("New Story created");
      res.redirect("/feed");
    } else {
      const errors = validationErrors.array().map((error) => error.msg);
      res.render("new-story", {
        story,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

module.exports = router;
