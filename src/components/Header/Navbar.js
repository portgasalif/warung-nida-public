import styles from "./Navbar.module.css";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Navbar = ({ setUser }) => {
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
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <Link to="/">🏬</Link>
        </div>
        <div className={styles.navLinks}>
          <Link to="/stocks">Stok</Link>
          <Link to="/history">Riwayat</Link>
          <button onClick={handleSignOut} className={styles.navButton}>
            Keluar
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
