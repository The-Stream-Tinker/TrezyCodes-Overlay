// Module imports
import create from 'zustand/vanilla'
import tinycolor from 'tinycolor2'





export const store = create((set, get) => ({
	badges: null,
	chatMessages: [],
	events: [],
	colourDictionary: {},
	isChatConnected: false,
	isChatConnecting: true,

	addChatMessage(messageObject) {
		const {
			chatMessages,
			colourDictionary,
		} = get()

		const newChatMessages = [...chatMessages]
		let newColourDictionary = colourDictionary

		if (newChatMessages.length) {
			const [mostRecentChatMessageGroup] = newChatMessages.splice(chatMessages.length - 1, 1)

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

		if (!colourDictionary[messageObject.userInfo.color]) {
			newColourDictionary = { ...colourDictionary }

			const foregroundColourObject = tinycolor(messageObject.userInfo.color)
			const backgroundColourObject = foregroundColourObject.clone()

			const colourAdjustmentMethod = foregroundColourObject.isDark() ? 'lighten' : 'darken'

			let comparisons = 0
			while(!tinycolor.isReadable(foregroundColourObject, backgroundColourObject, {level: 'AAA'}) && (comparisons < 100)) {
				foregroundColourObject[colourAdjustmentMethod](1)
				comparisons += 1
			}

			newColourDictionary = {
				...colourDictionary,
				[messageObject.userInfo.color]: {
					background: backgroundColourObject.toHexString(),
					foreground: foregroundColourObject.toHexString(),
				},
			}
		}

		set({
			chatMessages: newChatMessages,
			colourDictionary: newColourDictionary,
		})
	},

	addEvent(eventObject) {
		set(previousState => {
			const { events } = previousState

			return {
				events: [
					...events,
					eventObject,
				],
			}
		})
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
}))
