const express = require("express");
const router = express.Router();
const { validationResult, check } = require("express-validator");
const request = require("request");
const User = require("../models/User");
const config = require("config");
const Profile = require("../models/Profile");
const auth = require("../middleware/auth");
const { profile_url } = require("gravatar");

// getting logged in user's profile

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.status(400).send("this is no profile for this user");
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// creating / updating user's profile

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is Required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        errors: errors.array(),
      });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // build profile object

    const profileFields = {};

    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // building social object

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }
      // create profile
      profile = new Profile(profileFields);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

// get all profiles

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("users", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Profile Not found" });
  }
});

// get profile by user_id

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("users", ["name", "avatar"]);

    if (!profile) return res.status(400).send("No profile found");

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(400).send("No profile found");
    res.status(400).json({ msg: "server error" });
  }
});

// delete profile for logged in user

router.delete("/", auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({
      user: req.user.id,
    });

    await User.findOneAndRemove({ _id: req.user.id });

    if (!profile) return res.status(400).send("No profile found");

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == "ObjectId") return res.status(400).send("No profile found");
    res.status(400).json({ msg: "User Deleted" });
  }
});

// adding / updating the experince
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From Date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, current, to, from, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      current,
      to,
      from,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(400).json("Server ERROR");
    }
  }
);

// deleting the experince
router.delete("/experience/:exp_id", [auth], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.experience
      .map((exp) => exp.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("server error");
  }
});

// adding education

router.put(
  "/education",
  [
    auth,
    check("fieldofstudy", "Field of study is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("school", "School Date is required").not().isEmpty(),
    check("from", "From Date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    const { degree, school, fieldofstudy, current, to, from, description } =
      req.body;

    const newEdu = {
      degree,
      school,
      fieldofstudy,
      current,
      to,
      from,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(400).json("Server ERROR");
    }
  }
);

// deleting the education
router.delete("/education/:edu_id", [auth], async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    const removeIndex = profile.education
      .map((edu) => edu.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(400).send("server error");
  }
});

// getting the github repos

router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (err, response, body) => {
      if (err) console.error(err);

      // console.log("no errors");

      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: "No Github profile Found" });
      }

      res.status(200).json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

module.exports = router;
