const knex = require("../connection");
const jwt = require("jsonwebtoken");
const hashPass = require("../hashPass");
const aws = require("../Services/aws");

const loginVerification = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Not authorized");
  }

  try {
    const token = authorization.replace("Bearer ", "").trim();

    const { id } = jwt.verify(token, hashPass);

    const verifyUser = await knex("users").where("id", "=", id);

    const userProfile = verifyUser[0];

    if (verifyUser.length === 0) {
      return res.status(404).json("User not found");
    }

    userProfile.urlImage = userProfile.image
      ? aws.completeUrl(userProfile.image)
      : null;

    const { senha, ...user } = userProfile;

    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

module.exports = loginVerification;
