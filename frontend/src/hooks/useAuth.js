import { useSelector } from "react-redux";
import { selectCurrentToken } from "../Features/Auth/authSlice";
import jwtDecode from "jwt-decode";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);

  if (token) {
    const decoded = jwtDecode(token);
    const { id: userId, username, img } = decoded.userInfo;

    return { userId, username, img };
  }
  return { userId: "", username: "", img: "" };
};
export default useAuth;
