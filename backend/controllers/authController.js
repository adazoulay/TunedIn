const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const duplicateUsername = await User.findOne({ username }).lean().exec();
    if (duplicateUsername) {
      return res.status(409).json({ message: "Duplicate username" });
    }
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail) {
      return res.status(409).json({ message: "Duplicate email" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPwd = bcrypt.hashSync(req.body.password, salt);
    const userObject = { username, email, password: hashedPwd };
    const user = await User.create(userObject);

    if (user) {
      return res.status(201).json({ messsage: `New user: ${username} created` });
    } else {
      return res.status(400).json({ message: "Invalid user data recieved" });
    }
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({ message: "Wrong credentials" });
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          username: user.username,
          imageUrl: user.imageUrl,
          saved: user.saved,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          username: user.username,
          imageUrl: user.imageUrl,
          saved: user.saved,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    next(err); //! TODO
  }
};

const refresh = async (req, res, next) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const refreshToken = cookies.jwt;

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    const user = await User.findOne({ username: decoded.userInfo.username }).exec();

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const accessToken = jwt.sign(
      {
        userInfo: {
          id: user._id,
          username: user.username,
          imageUrl: user.imageUrl,
          saved: user.saved,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ accessToken });
  });
};

const signout = async (req, res, next) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

//! SPOTIFY

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3500/auth/spotifyCallback";

const generateRandomString = (length) => {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// const stateKey = "spotify_auth_state";

const spotifySignIn = (req, res) => {
  console.log("IN LGOIN");
  let state = generateRandomString(16);
  // res.cookie(stateKey, state);

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: "user-read-private user-read-email",
        redirect_uri: REDIRECT_URI,
        state: state,
      })
  );
};

const spotifyCallback = async (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        new URLSearchParams({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      params: {
        code: code,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " + new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      json: true,
    };
    try {
      const response = await axios(authOptions);
      let access_token = response.data.access_token;
      let refresh_token = response.data.refresh_token;
      let expires_in = response.data.expires_in;

      res.redirect(
        "/user/" +
          new URLSearchParams({
            access_token: access_token,
            refresh_token: refresh_token,
            expires_in: expires_in,
          })
      );
    } catch (error) {
      res.redirect(
        "/#" +
          new URLSearchParams({
            error: "invalid_token",
          })
      );
    }
  }
};

module.exports = { signup, signin, refresh, signout, spotifySignIn, spotifyCallback };

//To generate ACCESS_TOKEN_SECRET: in backend: node -> require('crypto').randomBytes(64).toString('hex')
