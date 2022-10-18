// Style imports
import styles from './StartingSoonPage.module.scss'





// Module imports
import {
	faDiscord,
	faTiktok,
	faTwitch,
	faTwitter,
	faYoutube,
} from '@fortawesome/free-brands-svg-icons'
import {
	AnimatePresence,
	motion,
} from 'framer-motion'
import {
	useEffect,
	useState,
} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





// Constants
const SOCIALS = [
	{
		colour: 'var(--palette-discord-blurple)',
		icon: faDiscord,
		handle: 'https://trezy.codes/discord',
	},
	{
		colour: 'var(--palette-twitter-blue)',
		icon: faTwitter,
		handle: '@TrezyCodes',
	},
	{
		colour: 'var(--palette-tiktok-pink)',
		icon: faTiktok,
		handle: '@TrezyCodes',
	},
	{
		colour: 'var(--palette-youtube-red)',
		icon: faYoutube,
		handle: 'TrezyCodes1',
	},
	{
		colour: 'var(--palette-twitch-purple)',
		icon: faTwitch,
		handle: 'TrezyCodes',
	},
]
const VARIANTS = {
	animate: {
		opacity: 1,
		transition: {
			delay: 2,
		},
		x: '0',
	},
	exit: {
		opacity: 0,
		y: '200px',
	},
	initial: {
		opacity: 0,
		x: '-200px',
	},
}





export function Socials() {
	const [socialIndex, setSocialIndex] = useState(0)

	useEffect(() => {
		const intervalID = setInterval(() => {
			setSocialIndex(previousState => {
				if (previousState + 1 > (SOCIALS.length - 1)) {
					return 0
				}

				return previousState + 1
			})
		}, 10000)

		return () => {
			clearInterval(intervalID)
		}
	}, [setSocialIndex])

	return (
		<div className={styles['socials']}>
			<AnimatePresence>
				{SOCIALS.map((social, index) => {
					if (index !== socialIndex) {
						return null
					}

					return (
						<motion.div
							key={index}
							animate={'animate'}
							exit={'exit'}
							initial={'initial'}
							style={{
								'--social-colour': social.colour,
							}}
							variants={VARIANTS}>
							<div className={styles['icon']}>
								<FontAwesomeIcon
									fixedWidth
									icon={social.icon} />
							</div>

							<motion.div
								animate={{
									transition: {
										delay: 2.15,
									},
									translate: 'calc(0% - 0px) 0',
								}}
								className={styles['handle']}
								initial={{
									translate: 'calc(-100% - 30px) 0',
								}}>
								{social.handle}
							</motion.div>
						</motion.div>
					)
				})}
			</AnimatePresence>
		</div>
	)
}
