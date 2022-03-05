const knex = require("../connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const hashPass = require("../hashPass");
const aws = require("../Services/aws");

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json("Email and password required");
  }

  try {
    const searchUsername = await knex("users").where("username", "=", username);

    if (searchUsername.length === 0) {
      return res.status(400).json("User not found");
    }

    const user = searchUsername[0];

    const correctPass = await bcrypt.compare(password, user.password);

    if (!correctPass) {
      return res.status(400).json("Wrong username or password");
    }

    const token = jwt.sign({ id: user.id }, hashPass, { expiresIn: "8h" });

    user.urlImage = user.image ? aws.completeUrl(user.image) : null;

    const { password: _, ...userData } = user;

    return res.status(200).json({
      user: userData,
      token,
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = {
  login,
};
