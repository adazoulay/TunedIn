import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";

const Signin = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const canSave = [username, password].every(Boolean) && !isLoading;
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (canSave) {
      try {
        const { accessToken } = await login({ username, password }).unwrap();
        dispatch(setCredentials({ accessToken }));
        setUsername("");
        setPassword("");
        navigate("/feed");
      } catch (err) {
        if (!err.status) {
          setErrMsg("No Server Response");
        } else if (err.status === 400) {
          setErrMsg("Missing Username or Password");
        } else if (err.status === 401) {
          setErrMsg("Unauthorized");
        } else {
          setErrMsg(err.data?.message);
        }
        errRef.current.focus();
      }
    }
  };

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='auth-section'>
      <h1>Sign In</h1>
      <p ref={errRef} className='' aria-live='assertive'>
        {errMsg}
      </p>
      <form className='wrapper-form' onSubmit={handleSubmit}>
        <div className='form-row'>
          <label className='form-label' htmlFor='username'>
            Username:
          </label>
          <input
            className='form-input'
            type='text'
            id='username'
            ref={userRef}
            value={username}
            onChange={handleUsernameChange}
            autoComplete='off'
            required
          />
        </div>
        <div className='form-row'>
          <label className='form-label' htmlFor='password'>
            Password:
          </label>
          <input
            className='form-input'
            type='password'
            id='password'
            onChange={handlePasswordChange}
            value={password}
            required
          />
        </div>
        <div className='button-row'>
          <div className='checkbox-wrapper-39'>
            <label>
              <input type='checkbox' id='persist' onChange={handleToggle} checked={persist} />
              <span className='checkbox'></span>
            </label>
          </div>
          <div className='checkbox-label'>Trust this device</div>
        </div>
        <button className='base-button' type='submit' disabled={!canSave}>
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Signin;
