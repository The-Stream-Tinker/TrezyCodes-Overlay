// Style imports
import styles from './Alerts.module.scss'





// Module imports
import classnames from 'classnames'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'





export function FollowAlert(props) {
	const { userDisplayName } = props

	const compiledClassName = classnames(styles['alert'], styles['follow-alert'])

	return (
		<div className={compiledClassName}>
			<header>
				<span className={styles['icon']}>
					<FontAwesomeIcon
						fixedWidth
						icon={faHeart} />
				</span>

				{'New Follower'}
			</header>

			<p>{`Thanks for the follow, ${userDisplayName}!`}</p>
		</div>
	)
}

FollowAlert.propTypes = {
	userDisplayName: PropTypes.string,
}
