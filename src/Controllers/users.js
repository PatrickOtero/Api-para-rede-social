const knex = require("../connection");
const bcrypt = require("bcrypt");
const aws = require("../Services/aws");

const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username) {
    return res.status(404).json("Username is required");
  }

  if (!password) {
    return res.status(404).json("Password is required");
  }

  try {
    const usernameCount = await knex("users").where("username", "=", username);

    if (usernameCount.length > 0) {
      return res.status(400).json("The username already exists");
    }

    const encryptedPass = await bcrypt.hash(password, 10);

    const user = await knex("users").insert({
      username,
      password: encryptedPass,
    });
    if (user.length === 0) {
      return res.status(400).json("User not found.");
    }

    return res.status(200).json("User registered sucessfuly!");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const findProfile = async (req, res) => {
  return res.status(200).json(req.user);
};

const updateProfile = async (req, res) => {
  const {
    username,
    password,
    name,
    image,
    site,
    bio,
    email,
    phone,
    sex,
    verified,
  } = req.body;

  if (
    !username &&
    !password &&
    !name &&
    !image &&
    !site &&
    !bio &&
    !email &&
    !phone &&
    !sex &&
    !verified
  ) {
    return res
      .status(404)
      .json("At least one profile data must be informed to be updated");
  }

  try {
    if (username) {
      if (username !== req.user.username) {
        const usernameCount = await knex("users").where(
          "username",
          "=",
          username
        );

        if (usernameCount.length > 0) {
          return res.status(400).json("Username already exists");
        }
      }
    }

    if (image === null && req.user.image) await aws.deleteImage(req.user.image);

    encryptedPass = await bcrypt.hash(password, 10);

    const updatedUser = await knex("users")
      .update({
        username,
        password: encryptedPass,
        name,
        image,
        site,
        bio,
        email,
        phone,
        sex,
        verified,
      })
      .where("id", "=", req.user.id);

    if (updatedUser.length === 0) {
      return res.status(400).json("User was not updated");
    }

    return res.status(200).json("User updated sucessfully");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  registerUser,
  findProfile,
  updateProfile,
};
