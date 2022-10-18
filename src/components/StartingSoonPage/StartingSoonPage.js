// Style imports
import styles from './StartingSoonPage.module.scss'





// Module imports
import { Socials } from './Socials.js'





// Local imports
import { Alerts } from '../Alerts/Alerts.js'
import { Chat } from '../Chat/Chat.js'





export function StartingSoonPage() {
	return (
		<div className={styles['starting-soon-page']}>
			<video
				autoPlay
				loop
				muted
				preload={'auto'}
				type={'video/mp4'}>
				<source src={'/videos/programming-code-2022-08-04-19-06-41-utc.mp4'} />
			</video>

			<header>
				{'Starting Soon...'}
			</header>

			<Socials />

			<Alerts className={styles['alerts']} />

			<Chat className={styles['chat']} />
		</div>
	)
}
