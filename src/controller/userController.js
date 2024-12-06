const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const knexConfig = require("../../knexfile");
const environment = process.env.NODE_ENV;
const knex = require("knex")(knexConfig[environment]);

class UserController {
  profile = async (req, res, next) => {
    try {
      const bearer = req.headers.authorization;
      const token = bearer.match(/^Bearer\s+(\S+)$/)[1];

      var data = jwt.verify(token, process.env.JWT_SECRET);

      res.status(200).json({
        code: 200,
        status: "success",
        message: data,
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: error,
      });
    }
  };
  update = async (req, res, next) => {
    const user = req.user;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

    console.log(user.id);
    if (!first_name || !last_name) {
      return res
        .status(400)
        .json({ message: "First name and last name are required" });
    }

    try {
      await knex.raw(
        "update users set first_name = :first_name, last_name = :last_name where id = :id",
        { first_name: first_name, last_name: last_name, id: user.id }
      );

      const data = await knex.raw("select * from users where id = ?", [user.id])
      const updated = data[0][0]
      console.log(data[0][0])
      res.status(200).json({
        status: 0,
        message: "Update Pofile berhasil",
        data: {
          email: updated.email,
          first_name: updated.first_name,
          last_name: updated.last_name,
          profile_image: updated.profile_image,
        },
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: error,
      });
    }
  };
  picture = async (req, res, next) => {
    const user = req.user;
    const file = req.file;
    try {
            await knex.raw(
        "update users set profile_image = :image where id = :id",
        { image: file.path , id: user.id }
      );
      res.status(200).json({
        code: 200,
        status: "status",
        message: file,
      });
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: error,
      });
    }
  }
}
module.exports = UserController;
