// @collapse

import styles from '../styles/Loading.module.css';

export function LoadingAnimation( ) {
    return (
        <div className={ styles.container }>
            <span>loading</span>
            <img src="/icons/key.svg"/>
        </div>
    )
}