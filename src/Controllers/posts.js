const knex = require("../connection");

const newPost = async (req, res) => {
  const { id } = req.user;
  const { text_body, photos } = req.body;

  if (!photos || photos.length === 0) {
    return res.status(404).json("At least one photo needs to be informed");
  }

  try {
    const post = await knex("posts")
      .insert({ text_body, user_id: id })
      .returning("*");

    if (!post) return res.status(400).json("The post was not created");

    for (const photo of photos) {
      photo.post_id = post[0].id;
    }

    const registeredPhotos = await knex("posts_photos").insert(photos);

    if (!registeredPhotos) {
      await knex("posts").where({ id: post[0].id }).del();
      return res
        .status(400)
        .json({ message: "Não foi possível concluir a postagem" });
    }

    return res.status(200).json({ message: "Post successfully made" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const likePost = async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;

  try {
    const post = await knex("posts").where({ id: postId }).first();

    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = await knex("posts_likes")
      .where({ user_id: id, post_id: post.id })
      .first();

    if (alreadyLiked)
      return res
        .status(404)
        .json({ message: "The user already liked that post" });

    const like = await knex("posts_likes").insert({
      user_id: id,
      post_id: post.id,
    });

    if (!like)
      return res
        .status(400)
        .json({ message: "Was not possible to like that post" });

    return res.status(200).json("Post liked successfully");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const commentPost = async (req, res) => {
  const { id } = req.user;
  const { postId } = req.params;
  const { text_body } = req.body;

  if (!text_body)
    return res
      .status(404)
      .json({ message: "It is not possible to create an empty comment" });

  try {
    const post = await knex("posts").where({ id: postId }).first();

    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await knex("posts_comments").insert({
      user_id: id,
      post_id: post.id,
      text_body,
    });

    if (!comment)
      return res
        .status(400)
        .json({ message: "Was not possible to like that post" });

    return res.status(200).json("Post commented successfully");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const postsFeed = async (req, res) => {
  const { id } = req.user;
  const { offset } = req.query;

  const index = offset ? offset : 0;

  try {
    const posts = await knex("posts")
      .where("user_id", "!=", id)
      .limit(10)
      .offset(index);

    if (posts.length === 0) return res.status(200).json(posts);

    for (const post of posts) {
      // usuario

      const user = await knex("users")
        .where({ id: post.user_id })
        .select("image", "username", "verified")
        .first();

      post.user = user;

      // fotos

      const photos = await knex("posts_photos")
        .where({ post_id: post.id })
        .select("image");
      post.photos = photos;

      // curtidas

      const likes = await knex("posts_likes")
        .where({ post_id: post.id })
        .select("user_id");

      post.likes = likes.length;

      // Já foi curtido pelo usuário?

      post.likedByUser = likes.find((like) => like.user_id === id)
        ? true
        : false;

      // comentários

      const comments = await knex("posts_comments")
        .leftJoin("users", "users.id", "posts_comments.user_id")
        .where({ post_id: post.id })
        .select("users.username", "posts_comments.text_body");

      post.comments = comments;
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { newPost, likePost, commentPost, postsFeed };
