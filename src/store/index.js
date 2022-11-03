// Module imports
import create from 'zustand/vanilla'
import LocalForage from 'localforage'
import { persist } from 'zustand/middleware'




// Local imports
import {
	ACTIONS,
	TwitchDataManager,
} from '../helpers/TwitchDataManager.js'





// Constants
const KEYS_TO_OMIT_FROM_PERSISTENCE = ['twitchDataManager']





const storeFn = (set, get) => ({
	badges: null,
	chatMessages: [],
	events: [],
	colourDictionary: {
		'#000000': {
			background: '#ffffff',
			foreground: '#000000',
		},
		'#ffffff': {
			background: '#000000',
			foreground: '#ffffff',
		},
	},
	twitchDataManager: new TwitchDataManager,

	addSystemMessage(message, type) {
		const newChatMessage = {
			content: {
				emotes: [{
					text: message,
					type: 'text',
				}],
			},
			id: 'connect',
			isSystem: true,
			type,
			userInfo: {
				badges: new Map,
				color: '#000000',
				displayName: 'System',
				userId: 'system',
			},
		}

		set(previousState => {
			const newChatMessages = [...previousState.chatMessages]

			if (newChatMessages.length) {
				const [mostRecentChatMessageGroup] = newChatMessages.splice(newChatMessages.length - 1, 1)

				if (mostRecentChatMessageGroup[0].userInfo.userId === 'system') {
					newChatMessages.push([
						...mostRecentChatMessageGroup,
						newChatMessage,
					])
				} else {
					newChatMessages.push(mostRecentChatMessageGroup)
					newChatMessages.push([newChatMessage])
				}
			} else {
				newChatMessages.push([newChatMessage])
			}

			return { chatMessages: newChatMessages }
		})

		return newChatMessage
	},

	async getBadges() {
		// Exit early if badges have already been retrieved
		if (get().badges) {
			return
		}

		const response = await fetch('/api/twitch/badges')
		const badges = await response.json()

		set({ badges })
	},
})

export const store = create(persist(storeFn, {
	name: 'overlay-storage',

	/** @returns {LocalForage} The storage engine to be used LocalForage. */
	getStorage() {
		LocalForage.config({
			name: 'overlay-storage',
		})
		return LocalForage
	},

	/**
	 * @param {object} state The Zustand state.
	 * @returns {object} The Zustand state without state that shouldn't be persisted.
	 */
	partialize(state) {
		const stateEntries = Object.entries(state)
		const filteredStateEntries = stateEntries.filter(([key]) => {
			return !KEYS_TO_OMIT_FROM_PERSISTENCE.includes(key)
		})
		return Object.fromEntries(filteredStateEntries)
	},
}))

const { twitchDataManager } = store.getState()

twitchDataManager.on(ACTIONS.CHAT_CONNECTING, () => {
	const { addSystemMessage } = store.getState()

	const pendingMessage = addSystemMessage('Connecting to chat...', 'pending')

	twitchDataManager.once(ACTIONS.CHAT_CONNECTED, () => {
		delete pendingMessage.type
		addSystemMessage('Connected!', 'success')
	})
})

twitchDataManager.on(ACTIONS.CHAT_MESSAGE, () => {
	const {
		chatMessages,
		colourDictionary,
	} = twitchDataManager

	store.setState(previousState => ({
		chatMessages: [
			...previousState.chatMessages,
			...chatMessages,
		],
		colourDictionary: {
			...previousState.colourDictionary,
			...colourDictionary,
		},
	}))
})

twitchDataManager.on(ACTIONS.EVENT, () => {
	const { events } = twitchDataManager

	store.setState({
		events: [
			...previousState.events,
			...events,
		],
	})
})
