const aws = require("../Services/aws");

const uploadImage = async (req, res) => {
  const { name, image } = req.body;

  const buffer = Buffer.from(image, "base64");

  try {
    await aws.sendImage(name, buffer);

    const imageResponse = {
      image: name,
      urlImage: aws.completeUrl(name),
    };
    return res.status(200).json(imageResponse);
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = { uploadImage };
