// Module imports
import { ChatClient } from '@twurple/chat'
import EventEmitter from 'events'
import tinycolor from 'tinycolor2'





// Local imports
import { serialiseTwitchMessage } from '../helpers/serialiseTwitchMessage.js'





// Constants
export const ACTIONS = {
	CHAT_CONNECTED: 'CHAT_CONNECTED',
	CHAT_CONNECTING: 'CHAT_CONNECTING',
	CHAT_MESSAGE: 'CHAT_MESSAGE',
	CONFIRM_CONNECT: 'CONFIRM_CONNECT',
	CONNECT: 'CONNECT',
	EVENT: 'EVENT',
}





export class TwitchDataManager extends EventEmitter {
	/****************************************************************************\
	 * Private instance properties
	\****************************************************************************/

	#broadcastChannel = new BroadcastChannel('overlay')

	#chatClient = new ChatClient({})

	#chatMessages = []

	#colourDictionary = {}

	#connectionTimeoutID = null

	#espSocket = null

	#events = []

	#isConnected = false





	/****************************************************************************\
	 * Constructor
	\****************************************************************************/

	constructor() {
		super()

		if (typeof window !== 'undefined') {
			this.#broadcastChannel.addEventListener('message', (...args) => this.#handleBroadcastMessage(...args))
			this.#initialise()
		}
	}





	/****************************************************************************\
	 * Private instance methods
	\****************************************************************************/

	#handleBroadcastMessage(event) {
		const {
			action,
			data,
		} = event.data

		switch (action) {
			case ACTIONS.CONFIRM_CONNECT:
				this.#isConnected = true
				clearTimeout(this.#connectionTimeoutID)
				break

			case ACTIONS.CONNECT:
				if (this.#isConnected) {
					this.#broadcastChannel.postMessage({ action: ACTIONS.CONFIRM_CONNECT })
				}
				break

			case ACTIONS.CHAT_MESSAGE:
				this.handleChatMessage(data)
				break

			case ACTIONS.EVENT:
				this.handleEvent(data)
				break
		}
	}

	#handleConnectionFailure() {
		this.#isConnected = true
		this.#initialiseChat()
		this.#initialiseEvents()
	}

	#handleChatAction(...args) {
		const [
			/* channel */,
			/* username */,
			/* message */,
			messageObject,
		] = args

		messageObject.content.value = (
			<em>
				{messageObject.content.value.replace(/.$/u, '').replace(/^.ACTION/u, '')}
			</em>
		)

		this.#handleChatMessage(...args)
	}

	#handleChatMessage(...args) {
		const [
			/* channel */,
			/* username */,
			/* message */,
			messageObject,
		] = args

		const serialisedMessageObject = serialiseTwitchMessage(messageObject)

		this.#broadcastChannel.postMessage({
			action: ACTIONS.CHAT_MESSAGE,
			data: serialisedMessageObject,
		})

		this.handleChatMessage(serialisedMessageObject)
	}

	#handleEvent(event) {
		const eventData = JSON.parse(event.data)

		if (eventData.action === 'PING') {
			return this.#espSocket.send(JSON.stringify({ action: 'PONG' }))
		} else if (eventData.action === 'PONG') {
			return
		}

		this.#broadcastChannel.postMessage({
			action: ACTIONS.EVENT,
			data: eventData,
		})

		this.handleEvent(eventData)
	}

	#initialise() {
		this.#broadcastChannel.postMessage({ action: ACTIONS.CONNECT })

		this.#connectionTimeoutID = setTimeout(() => this.#handleConnectionFailure(), 1000)
	}

	async #initialiseChat() {
		this.emit(ACTIONS.CHAT_CONNECTING)

		await this.#chatClient.connect()

		this.emit(ACTIONS.CHAT_CONNECTED)

		this.#chatClient.onAction((...args) => this.#handleChatAction(...args))
		this.#chatClient.onMessage((...args) => this.#handleChatMessage(...args))

		await this.#chatClient.onRegister(async () => {
			await this.#chatClient.join('TrezyCodes')
		})
	}

	#initialiseEvents() {
		this.#espSocket = new WebSocket('wss://esp.fdgt.dev')

		this.#espSocket.addEventListener('close', () => this.#initialiseEvents())

		this.#espSocket.addEventListener('open', () => {
			this.#espSocket.send(JSON.stringify({
				action: 'SUBSCRIBE',
				channel: 'TrezyCodes',
				event: 'channel.follow',
			}))
		})

		this.#espSocket.addEventListener('message', (...args) => this.#handleEvent(...args))
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	destroy() {
		this.#chatClient.quit()
		this.#espSocket.close()
	}

	handleChatMessage(messageObject) {
		const newChatMessages = [...this.#chatMessages]

		if (newChatMessages.length) {
			const [mostRecentChatMessageGroup] = newChatMessages.splice(newChatMessages.length - 1, 1)

			const isUserIDMatching = mostRecentChatMessageGroup[0].userInfo.userId === messageObject.userInfo.userId
			const isColourMatching = mostRecentChatMessageGroup[0].userInfo.color === messageObject.userInfo.color

			if (isUserIDMatching && isColourMatching) {
				newChatMessages.push([
					...mostRecentChatMessageGroup,
					messageObject,
				])
			} else {
				newChatMessages.push(mostRecentChatMessageGroup)
				newChatMessages.push([messageObject])
			}
		} else {
			newChatMessages.push([messageObject])
		}

		this.#chatMessages = newChatMessages

		if (!this.#colourDictionary[messageObject.userInfo.color]) {
			const foregroundColourObject = tinycolor(messageObject.userInfo.color)
			const backgroundColourObject = foregroundColourObject.clone()

			const colourAdjustmentMethod = foregroundColourObject.isDark() ? 'lighten' : 'darken'

			let comparisons = 0
			while(!tinycolor.isReadable(foregroundColourObject, backgroundColourObject, {level: 'AAA'}) && (comparisons < 100)) {
				foregroundColourObject[colourAdjustmentMethod](1)
				comparisons += 1
			}

			this.#colourDictionary = {
				...this.#colourDictionary,
				[messageObject.userInfo.color]: {
					background: backgroundColourObject.toHexString(),
					foreground: foregroundColourObject.toHexString(),
				},
			}
		}

		this.emit(ACTIONS.CHAT_MESSAGE)
	}

	handleEvent(event) {
		if (event.action === 'EVENT') {
			this.#events = [
				...this.#events,
				event,
			]
			this.emit(ACTIONS.EVENT)
		} else {
			console.log('Unrecognised event from ESP:', event)
		}
	}





	/****************************************************************************\
	 * Public instance methods
	\****************************************************************************/

	get chatMessages() {
		return this.#chatMessages
	}

	get colourDictionary() {
		return this.#colourDictionary
	}

	get events() {
		return this.#events
	}
}
