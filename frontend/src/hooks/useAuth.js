import { useSelector } from "react-redux";
import { selectCurrentToken } from "../Features/Auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const decoded = jwtDecode(token);
    const { id: userId, username, imageUrl, saved } = decoded.userInfo;
    return { userId, username, imageUrl, saved };
  }
  return { userId: "", username: "", imageUrl: "", saved: [] };
};
export default useAuth;
