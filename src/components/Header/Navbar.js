import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <Link to="/">🏬</Link>
        </div>
        <div className={styles.navLinks}>
          <Link to="/stocks">Stok</Link>
          <Link to="/history">Riwayat</Link>
          <Link to="/setting">Setting</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
