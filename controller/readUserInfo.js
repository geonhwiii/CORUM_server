let { user } = require("../models");
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

module.exports = async (req, res) => {
  try {
    const token = req.body.access_token;
    jwt.verify(token, secret, async (err, decoded) => {
      if (err) {
        res.status(401).send({
          success: false,
          message: "unauthorized"
        });
      } else if (Date.now() < decoded.exp) {
        res.status(401).send({
          success: false,
          message: "time out"
        });
      } else if (req.body.userId === decoded.userId) {
        let retrievedUser = await user.findOne({
          where: { userId: req.body.userId }
        });

        if(retrievedUser.dataValues.userId === req.body.userId){
          let result = await user.findOne({
            attributes: [
              "userId",
              "name",
              "nickname",
              "gender",
              "github_addr",
              "contact_email",
              "gitsu",
              "userImage",
              "tech",
              "company",
              "intro"
            ],
            where: {
              userId: req.body.userId
            }
          });
          res.status(200).json(result);
        } else {
          res.status(401).send({
            success: false,
            message: "does not have right to read this user"
          });
        }
      } else {
        throw new Error("invalid body");
      }
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server Error");
  }
};
