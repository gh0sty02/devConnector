const express = require("express");
const router = express.Router();
const { validationResult, check } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post(
  "/",
  [
    check("name", "Please enter a Name").not().isEmpty(),
    check("email", "Please Enter A valid Email").isEmail(),
    check("password", "Please Enter a password of length 6 or more").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;
    try {
      // check if user exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already Exists" }] });
      }

      // select gravitar

      const avatar = gravatar.url({
        s: "200",
        r: "pg",
        d: "mm",
      });

      // creating the new user instance
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      // hashing password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // saving the user

      user.save();

      // signing a jwt

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        process.env.jwtSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("something went wrong");
    }
  }
);

module.exports = router;
