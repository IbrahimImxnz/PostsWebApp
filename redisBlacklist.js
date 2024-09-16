require("dotenv").config();
const redis = require("redis");
const asyncHandler = require("express-async-handler");

const redisClient = redis.createClient(process.env.REDIS_URL);

/*const redisClient = redis.createClient({
  url: "redis://localhost:7000",
});*/
/*
(async () => {
  try {
    await redisClient.connect();
    //console.log("Connecting to the Redis");
  } catch (err) {
    console.error("Error connecting to Redis", err);
  }
})();*/

asyncHandler(async () => {
  await redisClient.connect();
})();

// redisClient.connect();
//console.log("Connecting to the Redis");

redisClient.on("ready", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Error in the Connection", err);
});

const checkToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // if (token == null) return res.sendStatus(401);

  /*redisClient.get(token, (err, result) => {
    if (err) return res.sendStatus(500);
    if (result)
      return res
        .status(401)
        .json({ success: true, message: "Token has been blacklisted" });
    next();
  });*/
  const result = await redisClient.get(token);
  if (result)
    return res
      .status(401)
      .json({ success: false, message: "Token is blacklisted" });
  next();
});

/*function blacklistToken(token) {
  redisClient.set(token, "blacklisted", "EX", 1800);
}*/
const blacklistToken = asyncHandler(async (token) => {
  await redisClient.set(token, "blacklsited", "EX", 1800);
});

module.exports = { checkToken, blacklistToken };
