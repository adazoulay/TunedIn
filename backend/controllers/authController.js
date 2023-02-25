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
          spotifyId: user.spotifyId,
          spotifyRefreshToken: user.spotifyRefreshToken,
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
          spotifyId: user.spotifyId,
          spotifyRefreshToken: user.spotifyRefreshToken,
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

    if (user.spotifyRefreshToken) {
      res.cookie("spotifyRefreshToken", user.spotifyRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

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
          spotifyId: user.spotifyId,
          spotifyRefreshToken: user.spotifyRefreshToken,
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
  res.clearCookie("spotifyRefreshToken", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};

//! SPOTIFY

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const stateKey = "spotify_auth_state";

scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
];

const spotifySignIn = (req, res) => {
  let state = req.params.jwtToken;
  res.cookie(stateKey, state);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scopes.join(" "),
        redirect_uri: REDIRECT_URI,
        state: state,
      })
  );
};

const spotifyCallback = async (req, res) => {
  const code = req.query.code || null;
  const jwtToken = req.query.state || null;
  let decoded = null;
  if (jwtToken) {
    decoded = jwt.verify(jwtToken, process.env.ACCESS_TOKEN_SECRET);
  } else {
    return res.status(401).message("no JWT provided");
  }
  const { id: userId } = decoded?.userInfo;
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: REDIRECT_URI,
  });
  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: params.toString(),
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
          "base64"
        )}`,
      },
    });
    if (response.status === 200) {
      const { access_token, refresh_token } = response.data;
      const queryParams = new URLSearchParams({
        access_token,
        refresh_token,
      }).toString();

      const userInfo = await axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + access_token,
        },
      });

      const spotifyId = userInfo?.data?.id ?? null;
      if (spotifyId) {
        await User.findByIdAndUpdate(userId, {
          $set: { spotifyId: spotifyId },
          $set: { spotifyRefreshToken: refresh_token },
        });
      }

      res.cookie("spotifyRefreshToken", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`http://localhost:3000/user/${userId}/?${queryParams}`);
    } else {
      const queryParams = new URLSearchParams({
        error: "invalid_token",
      }).toString();

      res.redirect(`/?${queryParams}`);
    }
  } catch (error) {
    res.send(error);
  }
};

const spotifyRefresh = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.spotifyRefreshToken) {
    return res.status(401).json({ message: "Spotfy no refresh: Unauthorized" });
  }
  const refresh_token = cookies.spotifyRefreshToken;
  try {
    const queryParams = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    }).toString();

    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: queryParams,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
          "base64"
        )}`,
      },
    });

    const userId = req.user.id;

    const topTracksResponse = await axios({
      method: "get",
      url: "https://api.spotify.com/v1/me/top/tracks/?limit=3&time_range=short_term",
      headers: {
        Authorization: "Bearer " + response.data.access_token,
      },
    });

    const topTracks = topTracksResponse.data.items.map((track) => track.id);

    const user = await User.findByIdAndUpdate(userId, {
      $set: { spotifyTrackIds: topTracks },
    });

    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = {
  signup,
  signin,
  refresh,
  signout,
  spotifySignIn,
  spotifyCallback,
  spotifyRefresh,
};

//To generate ACCESS_TOKEN_SECRET: in backend: node -> require('crypto').randomBytes(64).toString('hex')
