export const validateUsername = (req, res, next) => {
  const { username } = req.params;
  if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid username format" });
  }
  next();
};

export const validateProblemSlug = (req, res, next) => {
  const { slug } = req.params;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid problem slug" });
  }
  next();
};