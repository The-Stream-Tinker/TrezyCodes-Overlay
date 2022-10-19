// Style imports
import styles from './Chat.module.scss'





// Module imports
import {
	Fragment,
	useMemo,
} from 'react'
import {
	faCircleCheck,
	faCircleXmark,
	faSpinner,
} from '@fortawesome/free-solid-svg-icons'
import classnames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'





// Local imports
import { ChatMessage } from './ChatMessage.js'
import { ChatUser } from './ChatUser.js'
import { useStore } from '../../store/react.js'





export function Chat(props) {
	const { className } = props

	const {
		chatMessages,
		colourDictionary,
		isChatConnected,
		isChatConnecting,
	} = useStore(state => ({
		chatMessages: state.chatMessages,
		colourDictionary: state.colourDictionary,
		isChatConnected: state.isChatConnected,
		isChatConnecting: state.isChatConnecting,
	}))

	const compiledClassName = useMemo(() => {
		return classnames(className, styles['chat'])
	}, [className])

	return (
		<div className={compiledClassName}>
			<div
				className={styles['message-wrapper']}
				style={{
					'--user-background-colour': 'white',
					'--user-foreground-colour': 'black',
				}}>
				<header>
					<div className={styles['username']}>{'System'}</div>
				</header>

				<div className={classnames(styles['message'], styles['system'])}>
					{isChatConnecting && (
						<>
							{'Connecting to chat...'}
							<FontAwesomeIcon
								fixedWidth
								icon={faSpinner}
								spinPulse />
						</>
					)}

					{(!isChatConnecting && isChatConnected) && (
						<>
							{'Connected!'}
							<FontAwesomeIcon
								fixedWidth
								icon={faCircleCheck} />
						</>
					)}

					{(!isChatConnecting && !isChatConnected) && (
						<>
							{'Failed to connect to chat.'}
							<FontAwesomeIcon
								fixedWidth
								icon={faCircleXmark} />
						</>
					)}
				</div>
			</div>

			{chatMessages.map((chatMessageGroup, chatMessageGroupIndex) => {
				const colourPair = colourDictionary[chatMessageGroup[0].userInfo.color]

				return (
					<div
						key={chatMessageGroupIndex}
						className={styles['message-wrapper']}
						style={{
							'--user-background-colour': colourPair.background,
							'--user-foreground-colour': colourPair.foreground,
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
