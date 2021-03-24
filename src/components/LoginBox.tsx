import styles from '../styles/components/LoginBox.module.css';

import { MouseEvent } from 'react';

export function LoginBox() {
    function ClickEvent(event: MouseEvent) {
        event.preventDefault();
        alert("TODO == GET https://github.com/login/oauth/authorize");
    }

    return (
        <div className={styles.container} >
            <img src="/logo-full-white.svg" alt="Move-it Logo"/>
            <h1>Bem-Vindo</h1>

            <p>Faça login com seu Github para começar.</p>

            <form action="" onClick={ ClickEvent }>
                <input type="text" placeholder="Digite seu username" required/>
                <input type="submit" value=" "/>
            </form>
        </div>
    )
}