import styles from "./LoginForm.module.css";
import { useState } from "react";
import { signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import { auth } from "../../firebase";

const LoginForm = ({ setUser }) => {
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleEmailChange = (e) => {
    setEmailInput(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPasswordInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailInput,
        passwordInput
      );
      setUser(userCredential.user);
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login gagal. Silakan coba lagi.");
    }
  };
  const handleAnonymousLogin = async () => {
    try {
      // Demo credentials - untuk keperluan portofolio dan testing
      const ANONYMOUS_EMAIL = "anonymous@warung-nida.local";
      const ANONYMOUS_PASSWORD = "anonim123";

      const userCredential = await signInWithEmailAndPassword(
        auth,
        ANONYMOUS_EMAIL,
        ANONYMOUS_PASSWORD
      );
      setUser(userCredential.user);
    } catch (error) {
      console.error("Anonymous login failed:", error);
      alert("Masuk sebagai anonymous gagal. Silakan coba lagi.");
    }
  };
  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.loginTitle}>
          <h2>Masuk</h2>
        </div>
        <div className={styles.inputArea}>
          <input
            type="email"
            placeholder="Email"
            value={emailInput}
            onChange={handleEmailChange}
            className={styles.inputData}
            required
          />
          <input
            type="password"
            placeholder="Kata Sandi"
            value={passwordInput}
            onChange={handlePasswordChange}
            className={styles.inputData}
            required
          />
        </div>
        <div className={styles.buttonArea}>
          <button type="submit" className={styles.button}>
            Masuk
          </button>
          <button
            type="button"
            className={styles.anonymousButton}
            onClick={handleAnonymousLogin}
          >
            Masuk sebagai anonymous
          </button>
        </div>
      </form>
    </div>
  );
};
export default LoginForm;
