const getMe = async (req, res) => {
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
};
