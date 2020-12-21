const mongoose = require("mongoose");
const Post = require("./Post");

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Types.ObjectId,
    ref: "Post",
    required: [true, "Comment must belong a post"],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: [true, "Comment must belong a user"],
  },
  content: { type: String, required: [true, "Content is required"] },
  date: {
    type: Date,
    default: Date.now(),
  },
});

commentSchema.statics.commentOfPost = async function (postId, state) {
  const post = await Post.findById(postId);
  if (state === "increase") post.numberOfComments = post.numberOfComments + 1;
  else if (state === "decrease")
    post.numberOfComments =
      post.numberOfComments === 0 ? 0 : post.numberOfComments - 1;
  await post.save();
};

commentSchema.post("save", async function (doc, next) {
  doc.constructor.commentOfPost(doc.post, "increase");
  next();
});

commentSchema.post(/^findOneAndDelete/, async function (doc, next) {
  doc.constructor.commentOfPost(doc.post, "decrease");
  next();
});

module.exports = new mongoose.model("Comment", commentSchema);
