import { useState } from "react";
import "./Login.css";
import { useRef } from "react";

function Register(props) {
  const usernameInputRef = useRef();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const passwordConfInputRef = useRef();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const saveUserDataHandler = (enteredUserData) => {
    const userData = {
      ...enteredUserData,
      id: Math.random().toString(),
    };
    props.onAddUser(userData);
  };

  const sumbitHandler = (event) => {
    const enteredUsername = usernameInputRef.current.value;
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    const enteredPasswordConf = passwordConfInputRef.current.value;
    event.preventDefault();

    if (
      enteredUsername.trim().length == 0 ||
      enteredEmail.trim().length == 0 ||
      enteredPassword.trim().length == 0 ||
      enteredPasswordConf.trim().length == 0
    ) {
      console.log(enteredPasswordConf);
      console.log(enteredPassword);
      setError({
        title: "Invalid input",
        message:
          "Please enter a valid name or email or password (non-empty values)",
      });
      return;
    }

    if (enteredPasswordConf != enteredPassword) {
      setError({
        title: "Invalid input",
        message: "Your passwords are not matching. Please try again.",
      });
      return;
    }

    const userData = {
      username: enteredUsername,
      email: enteredEmail,
      password: enteredPassword,
    };

    saveUserDataHandler(userData);
    usernameInputRef.current.value = "";
    emailInputRef.current.value = "";
    passwordInputRef.current.value = "";
    passwordConfInputRef.current.value = "";
  };

  return (
    <form onSubmit={sumbitHandler}>
      <div className="form-group">
        <label htmlFor="username ">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          ref={usernameInputRef}
        />
      </div>

      <div className="form-group">
        <label htmlFor="">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          ref={emailInputRef}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          ref={passwordInputRef}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm password:</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          ref={passwordConfInputRef}
          required
        />
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

export default Register;
