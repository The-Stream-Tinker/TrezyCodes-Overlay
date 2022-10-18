// Style imports
import styles from './Chat.module.scss'





// Module imports
import classnames from 'classnames'





export function ChatMessage(props) {
	const { message } = props

	const compiledMessageClassName = classnames(styles['message'], {
		[styles['is-highlight']]: message.isHighlight,
	})

	return (
		<div className={compiledMessageClassName}>
			<p>
				{message.parseEmotes().map(segment => {
					if (segment.type === 'text') {
						return segment.text
					}

					return (
						<img src={`https://static-cdn.jtvnw.net/emoticons/v2/${segment.id}/default/dark/4.0`} />
					)
				})}
			</p>
		</div>
	)
}
