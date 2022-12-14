// Style imports
import styles from './StartingSoonPage.module.scss'





// Local imports
import { Alerts } from '../Alerts/Alerts.js'
import { Chat } from '../Chat/Chat.js'
import { Socials } from '../Socials/Socials.js'





export function StartingSoonPage() {
	return (
		<div className={styles['starting-soon-page']}>
			<iframe
				allow={'autoplay'}
				allowfullscreen
				frameborder={'0'}
				height={'2160'}
				src={'https://streamable.com/e/v782v6?autoplay=1&nocontrols=1'}
				width={'3840'} />

			<header>
				{'Starting Soon...'}
			</header>

			<Socials />

			<Alerts className={styles['alerts']} />

			<Chat className={styles['chat']} />
		</div>
	)
}
