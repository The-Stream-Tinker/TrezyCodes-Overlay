// Style imports
import styles from './ScreensharePage.module.scss'





// Local imports
import { Alerts } from '../Alerts/Alerts.js'
import { Chat } from '../Chat/Chat.js'
import classnames from 'classnames'





export function ScreensharePage() {
	const compiledScreenshareClassName = classnames(styles['frame'], styles['screenshare'])
	const compiledCameraClassName = classnames(styles['frame'], styles['camera'])

	return (
		<div className={styles['screenshare-page']}>
			<Alerts className={styles['alerts']} />

			<Chat className={styles['chat']} />

			<div className={styles['pipe']} />

			<div className={compiledScreenshareClassName} />

			<div className={compiledCameraClassName} />
		</div>
	)
}
