import { useRef, useState } from "react";
import "./Login.css";

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfInputRef = useRef();

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

    console.log(userData);
    saveUserDataHandler(userData);
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="form-group">
        <label htmlFor="">Email:</label>
        <input type="email" ref={emailInputRef} />
      </div>
      <div className="form-group">
        <label htmlFor="">Password:</label>
        <input type="password" ref={passwordInputRef} />
      </div>
      <div className="form-group">
        <p>
          Forgot your password? <a href="">Reset</a>
        </p>
      </div>
      <div className="buttons-white-theme">
        <button>Home</button>
        <button className="main-button" type="submit">
          Next
        </button>
      </div>
    </form>
  );
}

export default Login;
