import React from 'react';
import styles from './Logo.module.css';
import {FaHamburger} from "react-icons/fa";

type LogoProps = {
    className?: string;
};

const Logo: React.FC<LogoProps> = ({className}) => {
    return (
        <div className={`${styles.logoContainer} ${className || ''}`}>
            <span className={styles.word}>EL</span>
            <span className={styles.word}>BUEN</span>
            <span className={styles.wordHighlight}>SABOR</span>
            <FaHamburger size={40} className={styles.hamburgerIcon}/>
        </div>
    );
};

export default Logo;
