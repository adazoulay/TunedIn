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
      return res.status(409).json({ message: "Account already registered with this email" });
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
const SPOTIFY_AUTH_REDIRECT_URI = process.env.SPOTIFY_AUTH_REDIRECT_URI;
const stateKey = "spotify_auth_state";

scopes = [
  "user-read-private",
  "user-read-email",
  "user-top-read",
  "user-read-recently-played",
];

//! AUTH WITH SPOT

const authWithSpotify = async (req, res, next) => {
  let state = "auth";
  res.cookie(stateKey, state);
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scopes.join(" "),
        redirect_uri: SPOTIFY_AUTH_REDIRECT_URI,
        state: state,
      })
  );
};

const spotifyAuthCallback = async (req, res) => {
  const code = req.query.code || null;
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: SPOTIFY_AUTH_REDIRECT_URI,
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

      console.log("USER INFO TEST TESTS TEST TEST");
      console.log("ACCESS TOKEN", access_token);
      console.log("REFRESH TOKEN", refresh_token);

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

      newUserInfo = userInfo.data;
      const { display_name: username, email, images } = newUserInfo;

      let user = await User.findOne({ email }).lean().exec();

      if (!user) {
        const userObject = {
          username,
          email,
          spotifyRefreshToken: refresh_token,
          spotifyId: newUserInfo.id,
          imageUrl: images[0].url,
          authWithSpotify: true,
        };

        user = await User.create(userObject);
      } else if (!user?.authWithSpotify) {
        return res.status(400).json({
          message:
            "Please use email password login as account already registered with this email",
        });
      }

      res.cookie("spotifyRefreshToken", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      // const accessToken = jwt.sign(
      //   {
      //     userInfo: {
      //       id: user._id,
      //       username: user.username,
      //       imageUrl: user.imageUrl,
      //       saved: user.saved,
      //       spotifyId: user.spotifyId,
      //       spotifyRefreshToken: user.spotifyRefreshToken,
      //     },
      //   },
      //   process.env.ACCESS_TOKEN_SECRET,
      //   { expiresIn: "15m" }
      // );

      const refreshToken = jwt.sign(
        {
          userInfo: {
            id: user._id,
            username: user.username,
            imageUrl: user.imageUrl,
            saved: user.saved,
            spotifyId: user.spotifyId,
            spotifyRefreshToken: user.spotifyRefreshToken,
            authWithSpotify: true,
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

      const redirectUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://melonet.xyz";

      res.redirect(`${redirectUrl}/user/${user._id}/?${queryParams}`);
    } else {
      const queryParams = new URLSearchParams({
        error: "invalid_token",
      }).toString();

      res.redirect(`/?${queryParams}`);
    }
  } catch (error) {
    console.log("Err", error);
    res.send(error);
  }
};

//! CONNECT TO SPOT

const connectToSpotify = (req, res) => {
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

      res.cookie("spotifyRefreshToken", refresh_token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      console.log("USER INFO TEST TESTS TEST TEST");
      console.log("ACCESS TOKEN", access_token);
      console.log("REFRESH TOKEN", refresh_token);

      await User.findByIdAndUpdate(userId, {
        $set: { spotifyRefreshToken: refresh_token },
      });

      const redirectUrl =
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://melonet.xyz";

      res.redirect(`${redirectUrl}/user/${userId}/?${queryParams}`);
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

    console.log("REFRESH: TOP TRAKCS B4");
    const topTracksResponse = await axios({
      method: "get",
      url: "https://api.spotify.com/v1/me/top/tracks/?limit=3&time_range=short_term",
      headers: {
        Authorization: "Bearer " + response.data.access_token,
      },
    });

    console.log("REFRESH: TOP TRAKCS AFTER");

    const topTracks = topTracksResponse.data.items.map((track) => track.id);

    await User.findByIdAndUpdate(userId, {
      $set: { spotifyTrackIds: topTracks },
    });

    console.log("SETTING TRAKCS");

    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

const spotifyTempAuth = async (req, res) => {
  try {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      headers: {
        Authorization:
          "Basic " + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64"),
      },
      data: "grant_type=client_credentials",
    };

    const response = await axios.post(authOptions.url, authOptions.data, {
      headers: authOptions.headers,
    });

    if (response.status === 200) {
      const token = response.data;
      res.send(token);
    } else {
      res.status(response.status).send(response.data);
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signup,
  signin,
  refresh,
  signout,
  authWithSpotify,
  spotifyAuthCallback,
  connectToSpotify,
  spotifyCallback,
  spotifyRefresh,
  spotifyTempAuth,
};

//To generate ACCESS_TOKEN_SECRET: in backend: node -> require('crypto').randomBytes(64).toString('hex')
