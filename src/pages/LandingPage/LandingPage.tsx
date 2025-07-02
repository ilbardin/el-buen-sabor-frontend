import React from 'react';
import styles from './LandingPage.module.css';
import imagenPizza from '/pizza.png';

const LandingPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <header className={styles.navbar}>
                <div className={styles.logo}>
                    <span className={styles.logoIcon}>🌮</span>
                    <span>NUT</span>
                </div>
                <nav className={styles.navLinks}>
                    <a href="#">menu</a>
                    <a href="#">our specials</a>
                    <a href="#">our locations</a>
                    <a href="#">our cheffs</a>
                </nav>
                <div className={styles.actions}>
                    <span className={styles.icon}>🔍</span>
                    <span className={styles.icon}>🛒</span>
                    <span className={styles.icon}>👤</span>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.left}>
                    <p className={styles.subtitle}>
                        🌺 Life is uncertain. Eat taco first.
                    </p>
                    <h1 className={styles.title}>FOOD</h1>
                    <span className={styles.since}>1997</span>
                    <p className={styles.description}>
                        Food for us comes from our relatives, whether they have wings or fins or roots. That is how we
                        consider food. Food has a culture. It has a history. It has a story. It has relationships.
                    </p>
                    <button className={styles.orderButton}>ORDER NOW</button>
                </div>

                <div className={styles.right}>
                    <img src={imagenPizza} alt="Sombrero and maracas" className={styles.image}/>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.dishOfTheWeek}>
                    <h3>DISH OF THE WEEK</h3>
                    <p>Most ordered dish of the week</p>
                    <div className={styles.dishPrices}>
                        <div>$9.44 <br/>01. Vegan Chipotle</div>
                        <div>$12.48 <br/>02. One-Pan Chicken</div>
                        <div>$20 <br/>03. Tomato Salad</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
