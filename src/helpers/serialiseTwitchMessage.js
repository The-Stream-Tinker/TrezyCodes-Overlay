export function serialiseTwitchMessage(messageObject) {
	return {
		content: {
			emotes: messageObject.parseEmotes(),
			value: messageObject.content.value,
		},
		isHighlight: messageObject.isHighlight,
		userInfo: {
			badges: messageObject.userInfo.badges,
			color: messageObject.userInfo.color,
			displayName: messageObject.userInfo.displayName,
			userId: messageObject.userInfo.userId,
		},
	}
}
