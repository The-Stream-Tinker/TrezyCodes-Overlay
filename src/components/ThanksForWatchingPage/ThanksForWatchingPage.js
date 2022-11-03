// Style imports
import styles from './ThanksForWatchingPage.module.scss'





// Local imports
import { Socials } from '../Socials/Socials.js'





export function ThanksForWatchingPage() {
	return (
		<div className={styles['thanks-for-watching-page']}>
			<iframe
				allow={'autoplay'}
				allowfullscreen
				frameborder={'0'}
				height={'2160'}
				src={'https://streamable.com/e/v782v6?autoplay=1&nocontrols=1'}
				width={'3840'} />

			<header>
				{'Thanks for Watching!'}
			</header>

			<Socials />
		</div>
	)
}
