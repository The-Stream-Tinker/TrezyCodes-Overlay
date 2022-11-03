// Style imports
import styles from './Chat.module.scss'





// Module imports
import {
	Fragment,
	useMemo,
} from 'react'
import classnames from 'classnames'





// Local imports
import { ChatMessage } from './ChatMessage.js'
import { ChatUser } from './ChatUser.js'
import { useStore } from '../../store/react.js'





export function Chat(props) {
	const { className } = props

	const {
		chatMessages,
		colourDictionary,
	} = useStore(state => ({
		chatMessages: state.chatMessages,
		colourDictionary: state.colourDictionary,
	}))

	const compiledClassName = useMemo(() => {
		return classnames(className, styles['chat'])
	}, [className])

	return (
		<div className={compiledClassName}>
			{chatMessages.map(chatMessageGroup => {
				const colourPair = colourDictionary[chatMessageGroup[0].userInfo.color]

				return (
					<div
						key={chatMessageGroup[0].id}
						className={styles['message-wrapper']}
						style={{
							'--user-background-colour': colourPair?.background ?? '#fff',
							'--user-foreground-colour': colourPair?.foreground ?? '#000',
						}}>
						{chatMessageGroup.map((chatMessage, chatMessageIndex) => {
							return (
								<Fragment key={chatMessage.id}>
									{(chatMessageIndex === 0) && (
										<ChatUser user={chatMessage.userInfo} />
									)}

									<ChatMessage message={chatMessage} />
								</Fragment>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
