import { Outlet, Link } from "react-router-dom";
import styles from './layout.module.css';
import Footer from "./Footer";

const Layout = () => {
    return (
        <>
            <nav className={styles.navContainer}>
                <ul>
                    <div className={styles.leftcontainer}>
                        <li className={styles.navItem}>
                            <Link to='/' className={styles.navLink}>Home</Link>
                        </li>
                    </div>
                    <div className={styles.rightContainer}>
                        <li className={styles.navItem}>
                            <Link to='contact' className={styles.navLink}>Contact</Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link to='contact' className={styles.navLink}>Login</Link>
                        </li>
                        <button>Logout</button>
                    </div>
                </ul>
            </nav>
            <Outlet />

            <Footer />
        </>
    )
}

export default Layout;