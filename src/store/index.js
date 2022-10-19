// Module imports
import create from 'zustand/vanilla'
import tinycolor from 'tinycolor2'





export const store = create((set, get) => ({
	badges: null,
	chatMessages: [],
	events: [],
	colorDictionary: {},
	isChatConnected: false,
	isChatConnecting: true,

	addChatMessage(messageObject) {
		const {
			chatMessages,
			colorDictionary,
		} = get()

		const newChatMessages = [...chatMessages]
		let newColorDictionary = colorDictionary

		if (newChatMessages.length) {
			const [mostRecentChatMessageGroup] = newChatMessages.splice(chatMessages.length - 1, 1)

			if (mostRecentChatMessageGroup[0].userInfo.userId === messageObject.userInfo.userId) {
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

		if (!colorDictionary[messageObject.userInfo.color]) {
			newColorDictionary = { ...colorDictionary }

			const foregroundColorObject = tinycolor(messageObject.userInfo.color)
			const backgroundColorObject = foregroundColorObject.clone()

			const colorAdjustmentMethod = foregroundColorObject.isDark() ? 'lighten' : 'darken'

			let comparisons = 0
			while(!tinycolor.isReadable(foregroundColorObject, backgroundColorObject, {level: 'AAA'}) && (comparisons < 100)) {
				foregroundColorObject[colorAdjustmentMethod](1)
				comparisons += 1
			}

			newColorDictionary = {
				...colorDictionary,
				[messageObject.userInfo.color]: {
					background: backgroundColorObject.toHexString(),
					foreground: foregroundColorObject.toHexString(),
				},
			}
		}

		set({
			chatMessages: newChatMessages,
			colorDictionary: newColorDictionary,
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
