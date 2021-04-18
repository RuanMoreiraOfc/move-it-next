import styles from '../styles/components/LoginBox.module.css';

import { FormEvent } from 'react';
import { useRouter } from 'next/router';

export function LoginBox() {
    const router = useRouter();
    
    return (
        <div className={styles.container} >
            <img src="/logo-full-white.svg" alt="Move-it Logo"/>
            <h1>Bem-Vindo</h1>

            <p>Faça login com seu Github para começar.</p>

            <form method="GET" action="/api/auth/github/login">
                <input
                    required
                    type="text"
                    name="username"
                    placeholder="Digite seu username"
                    defaultValue={ router.query.username }
                />
                <input
                    type="submit"
                    value=" "
                />
            </form>
        </div>
    )
}