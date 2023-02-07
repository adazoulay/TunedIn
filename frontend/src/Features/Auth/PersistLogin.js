import { Outlet, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    console.log("persist", persist);
    console.log("effectRan", effectRan);
    console.log("token", token);
    console.log("trueSuccess", trueSuccess);
    console.log("process.env.NODE_ENV", process.env.NODE_ENV);
  }, [persist, effectRan, token, trueSuccess]);

  useEffect(() => {
    // if (effectRan.current === true || process.env.NODE_ENV !== "development") {
    const verifyRefreshToken = async () => {
      console.log("verifying refresh token");
      try {
        await refresh();
        setTrueSuccess(true);
      } catch (err) {
        console.error(err);
      }
    };

    if (!token && persist) verifyRefreshToken();
    // }

    return () => (effectRan.current = true);
  }, []);

  let content;
  if (!persist) {
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    console.log("loading");
    content = <div>Loading...</div>;
  } else if (isError) {
    console.log("error");
    content = (
      <p className='errmsg'>
        {`${error?.data?.message} - `}
        <Link to='/login'>Please login again</Link>.
      </p>
    );
  } else if (isSuccess && trueSuccess) {
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }
  return content;
};

export default PersistLogin;
