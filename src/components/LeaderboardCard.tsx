import styles from "../styles/components/LeaderboardCard.module.css";

import { IAddBody } from "../pages/api/database/mongo/add";

import { Profile } from "./Profile";

export interface ILeaderboardCardProps extends IAddBody {
    index: number;
    highlighted: boolean;
}

export function LeaderboardCard( {index, tasks, exp, highlighted, ...profileProps}: ILeaderboardCardProps ) {
    return (
        <div className={ `${ styles.container }${ highlighted ? ' ' + styles.highlight : '' }` }>
            <span className={ styles.index }>{ index }</span>
            <div className={ styles.dataContainer }>
                <span className={ styles.user }>
                    <Profile { ...profileProps } />
                </span>
                <span className={ styles.tasks }><strong>{ tasks }</strong> completados</span>
                <span className={ styles.exp }><strong>{ exp }</strong> xp</span>
            </div>
        </div>
    )
}