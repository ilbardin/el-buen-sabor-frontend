import React from 'react';
import styles from './Logo.module.css';
import {FaHamburger} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../constants/routes.ts";

type LogoProps = {
    className?: string;
};

const Logo: React.FC<LogoProps> = ({className}) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.logoContainer} ${className || ''}`} onClick={() => navigate(ROUTES.HOME, {replace: true})}>
            <span className={styles.word}>EL</span>
            <span className={styles.word}>BUEN</span>
            <span className={styles.wordHighlight}>SABOR</span>
            <FaHamburger size={40} className={styles.hamburgerIcon}/>
        </div>
    );
};

export default Logo;
