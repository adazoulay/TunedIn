import { useState, useEffect } from "react";
import { useSignupMutation } from "./authApiSlice";
import { useLoginMutation } from "./authApiSlice"; //! TODO login use creds and reroute to user page
import { useNavigate } from "react-router-dom";
import { Save } from "react-feather";

const signup = ({ dropdownRef }) => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] = useSignupMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      navigate("/feed");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);

  const canSave = [username, email, password].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewUser({ username, email, password });
    }
  };

  const content = (
    <div className='auth-section' ref={dropdownRef}>
      <h1>Sign Up</h1>
      <p>{error?.data?.message}</p>
      <form className='wrapper-form' onSubmit={onSaveUserClicked}>
        <div className='form-row'>
          <label className='form-label' htmlFor='signUpUsername'>
            Username: <span className='field-info'>[3-20 letters]</span>
          </label>
          <input
            className='form-input'
            id='signUpUsername'
            name='username'
            type='text'
            autoComplete='off'
            value={username}
            onChange={onUsernameChanged}
          />
        </div>
        <div className='form-row'>
          <label className='form-label' htmlFor='email'>
            Email: <span className='field-info'>[3-20 letters]</span>
          </label>
          <input
            className='form-input'
            id='email'
            name='email'
            type='text'
            autoComplete='off'
            value={email}
            onChange={onEmailChanged}
          />
        </div>
        <div className='form-row'>
          <label className='form-label' htmlFor='signUpPassword'>
            Password: <span className='field-info'>[4-12 chars]</span>
          </label>
          <input
            className='form-input'
            id='signUpPassword'
            name='password'
            type='password'
            value={password}
            onChange={onPasswordChanged}
          />
        </div>
        <div className='button-row'>
          <button className='base-button' title='Save' disabled={!canSave}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );

  return content;
};
export default signup;
