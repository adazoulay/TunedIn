import { useSelector } from "react-redux";
import { selectCurrentToken } from "../Features/Auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const decoded = jwtDecode(token);
    const {
      id: userId,
      username,
      imageUrl,
      saved,
      spotifyId,
      spotifyRefreshToken,
    } = decoded.userInfo;

    return { userId, username, imageUrl, saved, spotifyId, spotifyRefreshToken };
  }
  return {
    userId: "",
    username: "",
    imageUrl: "",
    saved: [],
    spotifyId: "",
    spotifyRefreshToken: "",
  };
};
export default useAuth;
