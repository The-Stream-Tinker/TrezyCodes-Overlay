// Style imports
import styles from './Chat.module.scss'





// Module imports
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





// Local imports
import { useStore } from '../../store/react.js'





export function ChatUser(props) {
	const { user } = props
	const { badges } = useStore(state => ({ badges: state.badges }))

	return (
		<header>
			<div className={styles['username']}>
				{user.displayName}
			</div>

			{Boolean(user.badges.size) && (
				<div className={styles['badges']}>
					{Array.from(user.badges.keys()).map((badge) => {
						if (!badges) {
							return (
								<FontAwesomeIcon
									fixedWidth
									icon={faSpinner} />
							)
						}

						const badgeURL = (badges.channel[badge] ?? badges.global[badge])[user.badges.get(badge)]

						return (
							<img src={badgeURL} />
						)
					})}
				</div>
			)}
		</header>
	)
}
