// Module imports
import { ChatClient } from '@twurple/chat'




// Local imports
import { store } from '../store/index.js'





// Constants
const twitchChatClient = new ChatClient({})





/**
 * Initialises a connection to the Twitch messaging interface and stores messages in the Zustand store.
 */
export async function initialiseTwitchChat() {
	await twitchChatClient.connect()
	store.setState({
		isChatConnected: true,
		isChatConnecting: false,
	})

	twitchChatClient.onMessage(async (...args) => {
		const [
			/* channel */,
			/* username */,
			/* message */,
			messageObject,
		] = args

		const { addChatMessage } = store.getState()

		addChatMessage(messageObject)
	})

	await twitchChatClient.onRegister(async () => {
		await twitchChatClient.join('TrezyCodes')
	})

	return () => twitchChatClient.quit()
}
