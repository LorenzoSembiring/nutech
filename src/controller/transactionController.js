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
            const totalBalance = parseInt(currentBalance[0][0].balance) + parseInt(amount);
            
            const update = await knex.raw(
                "UPDATE users SET balance = :balance WHERE id = :id;",
                { balance: totalBalance, id: user.id }
            );

            const invoice = await this.invoiceGenerator();

            await knex.raw(
              `INSERT INTO transactions (id, user_id, transaction_type, description, total_amount, created_on) VALUES (:invoice, :user, :type, :description, :amount, NOW());`,
              {
                invoice: invoice,
                user: user.id,
                type: "topup",
                description: "topup",
                amount: amount
              }
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
      const serviceCode = req.body.service_code;
      const amount = req.body.amount;
  
      try {
          const serviceCheck = await knex("services")
              .where("service_code", serviceCode)
              .first();
  
          if (!serviceCheck) {
              return res.status(404).json({
                  status: 102,
                  message: "Service atau Layanan tidak ditemukan",
                  data: null,
              });
          }
  
          const currentBalance = await knex("users")
              .where("id", user.id)
              .select(knex.raw("coalesce(balance, 0) as balance"))
              .first();

          const tariff = parseInt(serviceCheck.service_tariff);
          const currentBalanceValue = currentBalance.balance;

          if (tariff > currentBalanceValue) {
            return res.status(500).json({
              code: 500,
              message: "saldo anda tidak mencukupi",
          });
          }
          const invoiceNumber = await this.invoiceGenerator()

          await knex.raw(
            `INSERT INTO transactions (id, user_id, transaction_type, description, total_amount,created_on) VALUES (?, ?, ?, ?, ?, ?)`,
            [
              invoiceNumber,
              user.id,
              "PAYMENT",
              "Payment for service",
              amount,
              new Date()
            ]
          );
          
  
          return res.status(200).json({
              status: 0,
              message: "Transaksi berhasil",
              data: {
                  invoice_number: invoiceNumber,
                  service_code: serviceCheck.service_code,
                  service_name: serviceCheck.service_name,
                  transaction_type: "PAYMENT",
                  total_amount: amount,
                  created_on: new Date().toISOString(),
              },
          });
      } catch (error) {
          console.error(error);
          return res.status(500).json({
              code: 500,
              status: "error",
              message: error.message  ,
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
    invoiceGenerator = async () => {
        const date = new Date(Date.now());
        const formattedDate = date
            .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })
            .replace(/\//g, "");

        const data = await knex.raw(
            `
        SELECT COUNT(*) AS transaction_count 
        FROM transactions 
        WHERE DATE(created_on) = DATE(?);
      `,
            [date.toISOString().split("T")[0]]
        );

        const transactionCount = data[0][0]?.transaction_count || 0;
        const transactionNumber = (transactionCount + 1)
            .toString()
            .padStart(3, "0");

        return `INV${formattedDate}-${transactionNumber}`;
    };
}

module.exports = TransactionController;
