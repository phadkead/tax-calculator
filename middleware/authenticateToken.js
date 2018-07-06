function verify(req, res, next) {
  if (req.headers['x-secrettoken'] && req.headers['x-secrettoken'] === 'WeWouldLoveToWorkForYou') {
    return next();
  }
  return unauthorizedResponse(res);
}

function unauthorizedResponse(res) {
  return res.status(403).json({
    success: false,
    message: 'Invalid token',
  });
}

module.exports = {
  verify,
};
