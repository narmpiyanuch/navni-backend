const jwt = require("jsonwebtoken");

function createAccessToken(idUser) {
  const payload = { userId: idUser };
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET_KEY || "aasdfghjkswjkffkkfkvjnekk",
    { expiresIn: process.env.JWT_EXPIRE }
  );
  return accessToken;
}

module.exports = createAccessToken;
