const bcrypt = require("bcrypt");
const client = require("../configs/database");
const jwt = require("jsonwebtoken");

// Register a new user

exports.register = async (req, res) => {
  const { name, email, phonenumber, password } = req.body;
  try {
    const data = await client.query(
      `
         SELECT * FROM users WHERE email = $1`,
      [email]
    );
    const arr = data.rows;
    if (arr.length > 0) {
      res.status(400).json({
        message: "User already exists",
      });
    } else {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          res.status(err).json({
            error: "Error hashing password",
          });
        }
        const user = {
          name,
          email,
          phonenumber,
          password: hash,
        };
        let flag = 1;
        client.query(
          `INSERT INTO users (name, email, phonenumber, password) VALUES ($1,$2,$3,$4);`,
          [user.name, user.email, user.phonenumber, user.password],
          (err) => {
            if (err) {
              flag = 0;
              res.status(500).json({
                error: "Error inserting user",
              });
            } else {
              flag = 1;
              res.status(201).json({
                message: "User created successfully",
              });
            }
          }
        );
        if (flag) {
          const token = jwt.sign(
            {
              email: user.email,
            },
            process.env.SECRET_KEY
          );
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Database error while registering user",
    });
  }
};
