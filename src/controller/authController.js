const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator")
const knexConfig = require("../../knexfile");
const environment = process.env.NODE_ENV;
const knex = require("knex")(knexConfig[environment]);

class AuthController {
  register = async (req, res, next) => {

    const saltRounds = 10;
    const email = req.body.email;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const password = req.body.password;

    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const existedUser = await knex.raw('select * from users where email = ?', [email])
      console.log(existedUser[0].length)
      if (existedUser[0].length !== 0) {
        res.status(400).json({
          code: 400,
          status: "bad request",
          message: "email already existed.",
        });
        return;
      }
      
      const id = await knex.raw('INSERT INTO users (email, first_name, last_name, password) VALUES (:email, :first_name, :last_name, :password)', {email: email, first_name: first_name, last_name: last_name, password: hashedPassword})
      
        const data = await knex.raw('select * from users where id = ?', [id[0].insertId])
      res.status(201).json({
        code: 201,
        status: "created",
        data: data[0],
      });
    } catch (err) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: err,
      });
      next(err);
    }
  };

  login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
      const user = await knex.raw('select * from users where email = ?', [email])
      if (!user) {
        res.status(401).json({
          code: 401,
          status: "unauthorized",
          message: "incorrect email or password",
        });
        return;
      }
      const isSame = await bcrypt.compare(password, user[0][0].password);
      if (!isSame) {
        res.status(401).json({
          code: 401,
          status: "unauthorized",
          message: "incorrect email or password",
        });
        return;
      }
      const token = jwt.sign({ user: user[0][0] }, process.env.JWT_SECRET, {
        expiresIn: '30d'
      });
      console.log(user[0][0])
      res.status(200).json({
        code: 200,
        status: "success",
        data: {
          user: user[0],
          token
        },
      });
    } catch (err) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: err,
      });
      next(err);
    }
  };

  verify = async (req, res, next) => {
    const bearer = req.headers.authorization;
    const token = bearer.match(/^Bearer\s+(\S+)$/)[1];
    try {
      if (typeof bearer !== 'undefined') {
        try {
          var data = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
          if(err.name == "TokenExpiredError") {
            return res.status(401).json({
              code: 401,
              status: "unauthorized"
            })
          }
          return res.status(500).json({
            code: 500,
            status: "fail",
            error: err
          })
        }
      }

      res.status(200).json({
        code: 200,
        status: "success",
        data: data
      });
    
    } catch (error) {
      res.status(500).json({
        code: 500,
        status: "error",
        message: error,
      });
    }
  };
}
module.exports = AuthController;
