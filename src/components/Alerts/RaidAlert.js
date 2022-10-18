// Style imports
import styles from './Alerts.module.scss'





// Module imports
import classnames from 'classnames'
import { faBomb } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'





export function RaidAlert(props) {
	const {
		raidingBroadcasterDisplayName,
		viewers,
	} = props

	const compiledClassName = classnames(styles['alert'], styles['raid-alert'])

	return (
		<div className={compiledClassName}>
			<header>
				<FontAwesomeIcon
					fixedWidth
					icon={faBomb} />
				{'Raid!'}
			</header>

			<p>{`${raidingBroadcasterDisplayName} has raided us with ${viewers} viewers!`}</p>
		</div>
	)
}

RaidAlert.propTypes = {
	raidingBroadcasterDisplayName: PropTypes.string,
	viewers: PropTypes.number,
}
