import styles from "./Setting.module.css";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useTheme } from "../../contexts/ThemeContext";
const Setting = ({ setUser, userSession }) => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Gagal keluar, silakan coba lagi.");
    }
  };

  return (
    <div className={styles.settingContainer}>
      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.profilePicture}>
            {userSession?.email.charAt(0).toUpperCase() || "U"}
          </div>
          <div className={styles.profileInfo}>
            <h2>{userSession?.email}</h2>
          </div>
        </div>
      </div>
      <button onClick={toggleTheme} className={styles.toggleButton}>
        {isDark ? "Light Mode" : "Dark Mode"}
      </button>
      <button onClick={handleSignOut} className={styles.logoutButton}>
        Keluar
      </button>
    </div>
  );
};
export default Setting;
