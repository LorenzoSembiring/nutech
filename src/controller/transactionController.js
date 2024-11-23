const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const knexConfig = require("../../knexfile");
const environment = process.env.NODE_ENV;
const knex = require("knex")(knexConfig[environment]);

class TransactionController {
  balance = async (req, res, next) => {
    const user = req.user;
    try {
      const data = await knex.raw(
        "select coalesce(balance, 0) as balance from users where id = ?",
        [user.id]
      );
      return res.status(200).json({
        code: 200,
        message: "Get Balance Berhasil",
        data: data[0][0],
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: err,
      });
    }
  };
  topup = async (req, res, next) => {
    const user = req.user;
    const amount = req.body.top_up_amount;

    try {
      const currentBalance = await knex.raw(
        "select coalesce(balance, 0) as balance from users where id = ?",
        [user.id]
      );
      console.log(currentBalance[0][0].balance);
      const totalBalance =
        parseInt(currentBalance[0][0].balance) + parseInt(amount);
      const update = await knex.raw(
        "UPDATE users SET balance = :balance WHERE id = :id;",
        { balance: totalBalance, id: user.id }
      );

      return res.status(200).json({
        status: 0,
        message: "Top Up Balance berhasil",
        data: {
          balance: totalBalance,
        },
      });
    } catch (err) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: err.message,
      });
    }
  };
  transaction = async (req, res, next) => {
    const user = req.user;
    const service = req.body.service_code;
    const amount = req.body.amount;
    try {
      const serviceCheck = await knex.raw(
        "select * from services where service_code = ?",
        [service]
      );

      if (serviceCheck[0].length == 0) {
        return res.status(404).json({
          status: 102,
          message: "Service ataus Layanan tidak ditemukan",
          data: null,
        });
      }

      const currentBalance = await knex.raw(
        "select coalesce(balance, 0) as balance from users where id = ?",
        [user.id]
      );
      const tariff = parseInt(serviceCheck[0][0].service_tariff)
      console.log(currentBalance[0][0].balance)
      console.log(tariff)
      
      return res.status(200).json({
        status: 0,
        message: "Transaksi berhasil",
        data: {
          invoice_number: "INV17082023-001",
          service_code: "PLN_PRABAYAR",
          service_name: "PLN Prabayar",
          transaction_type: "PAYMENT",
          total_amount: 10000,
          created_on: "2023-08-17T10:10:10.000Z",
        },
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: error,
      });
    }
  };
  history = async (req, res, next) => {
    const user = req.user;
    try {
      const data = await knex.raw(
        "select * from transactions where user_id = ?",
        [user.id]
      );

      return res.status(200).json({
        code: 200,
        data: data[0],
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        status: "error",
        message: error,
      });
    }
  };
}

module.exports = TransactionController;
