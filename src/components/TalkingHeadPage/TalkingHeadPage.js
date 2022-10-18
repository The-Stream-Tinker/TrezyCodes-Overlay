// Style imports
import styles from './TalkingHeadPage.module.scss'





// Local imports
import { Alerts } from '../Alerts/Alerts.js'
import { Chat } from '../Chat/Chat.js'





export function TalkingHeadPage() {
	return (
		<div className={styles['talking-head-page']}>
			<div className={styles['frame']} />

			<Alerts className={styles['alerts']} />
			<Chat className={styles['chat']} />
		</div>
	)
}
