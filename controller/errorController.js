module.exports = (error, req, res, next) => {
  console.log(error);
  res.status(400).json({
    error,
  });
};
