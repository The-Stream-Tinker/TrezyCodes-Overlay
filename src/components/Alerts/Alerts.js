// Style imports
import styles from './Alerts.module.scss'





// Module imports
import classnames from 'classnames'
import PropTypes from 'prop-types'





// Local imports
import { FollowAlert } from './FollowAlert.js'
import { RaidAlert } from './RaidAlert.js'
import { useStore } from '../../store/react.js'





// Constants
const alertComponentDictionary = {
	'channel.follow': FollowAlert,
	'channel.raid': RaidAlert,
}





export function Alerts(props) {
	const { className } = props
	const compiledClassName = classnames(styles['alerts'], className)

	const { events } = useStore(state => ({ events: state.events }))

	return (
		<div className={compiledClassName}>
			{events.map(event => {
				const AlertComponent = alertComponentDictionary[event.event]

				return (
					<AlertComponent {...event.data} />
				)
			})}
		</div>
	)
}

Alerts.defaultProps = {
	className: '',
}

Alerts.propTypes = {
	className: PropTypes.string,
}
