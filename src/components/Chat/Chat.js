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
		colorDictionary,
		isChatConnected,
		isChatConnecting,
	} = useStore(state => ({
		chatMessages: state.chatMessages,
		colorDictionary: state.colorDictionary,
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
					'--user-background-color': 'white',
					'--user-foreground-color': 'black',
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
				return (
					<div
						key={chatMessageGroupIndex}
						className={styles['message-wrapper']}
						style={{
							'--user-background-color': colorDictionary[chatMessageGroup[0].userInfo.color].background,
							'--user-foreground-color': colorDictionary[chatMessageGroup[0].userInfo.color].foreground,
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
