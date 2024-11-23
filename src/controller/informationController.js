const validator = require("validator");
const knexConfig = require("../../knexfile");
const environment = process.env.NODE_ENV;
const knex = require("knex")(knexConfig[environment]);

class InformationController {
    banner = async (_, res, next) => {
        try {
            const data = await knex.raw('select * from banners')

            return res.status(200).json({
                code: 200,
                status: "success",
                data: data[0],
              });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                status: "error",
                message: error,
              }); 
        }
    }
    service = async (_, res, next) => {
        try {
            const data = await knex.raw('select * from services')

            return res.status(200).json({
                code: 200,
                status: "success",
                data: data[0],
              });
        } catch (error) {
            return res.status(500).json({
                code: 500,
                status: "error",
                message: error,
              }); 
        }
    }
}

module.exports = InformationController