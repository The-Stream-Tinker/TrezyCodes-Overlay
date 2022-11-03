// Style imports
import styles from './Chat.module.scss'





// Module imports
import {
	faCircleCheck,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





export function ChatMessage(props) {
	const { message } = props

	const compiledMessageClassName = classnames(styles['message'], {
		[styles['is-highlight']]: message.isHighlight,
		[styles['system']]: message.isSystem,
	})

	return (
		<div className={compiledMessageClassName}>
			<p>
				{message.content.emotes.map((segment, index) => {
					return (
						<span key={index}>
							{(segment.type === 'text') && segment.text}
							{(segment.type !== 'text') && (
								<img src={`https://static-cdn.jtvnw.net/emoticons/v2/${segment.id}/default/dark/4.0`} />
							)}
						</span>
					)
				})}
			</p>

			{(message.type === 'pending') && (
				<FontAwesomeIcon
					fixedWidth
					icon={faSpinner}
					spinPulse />
			)}

			{(message.type === 'success') && (
				<FontAwesomeIcon
					fixedWidth
					icon={faCircleCheck} />
			)}
		</div>
	)
}
