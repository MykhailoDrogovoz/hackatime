import { useRef, useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";

function Login(props) {
  const [error, setError] = useState(null);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [loading, setLoading] = useState(false);

  const saveUserDataHandler = (enteredUserData) => {
    const userData = {
      ...enteredUserData,
    };
    props.onLoginUser(userData);
  };

  const submitHandler = (event) => {
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    event.preventDefault();

    if (enteredEmail.trim().length == 0 || enteredPassword.trim().length == 0) {
      setError({
        title: "Invalid input",
        message:
          "Please enter a valid title or amount or date (non-empty values)",
      });
      return;
    }

    const userData = {
      email: enteredEmail,
      password: enteredPassword,
    };

    saveUserDataHandler(userData);
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="">Email:</label>
        <input type="email" ref={emailInputRef} required />
      </div>
      <div className="form-group">
        <label htmlFor="">Password:</label>
        <input type="password" ref={passwordInputRef} required />
      </div>
      <div className="form-group">
        <p>
          Forgot your password? <Link to="/reset-password-token">Reset</Link>
        </p>
      </div>
      <div className="buttons-white-theme">
        <button>Home</button>
        <button className="main-button" type="submit" disabled={props.loading}>
          {props.loading ? "Loading..." : "Next"}
        </button>
      </div>
    </form>
  );
}

export default Login;
