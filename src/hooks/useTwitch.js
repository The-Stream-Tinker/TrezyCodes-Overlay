// Module imports
import { useEffect } from 'react'





// Local imports
import { initialiseTwitchChat } from '../helpers/initialiseTwitchChat.js'
import { initialiseTwitchEvents } from '../helpers/initialiseTwitchEvents.js'
import { useStore } from '../store/react.js'





export function useTwitch() {
	const {
		getBadges,
	} = useStore(state => ({
		getBadges: state.getBadges,
	}))

	useEffect(() => {
		getBadges()
	}, [getBadges])

	useEffect(() => {
		const unsubscribers = []

		Promise
			.all([
				initialiseTwitchChat(),
				initialiseTwitchEvents(),
			])
			.then(unsubscribeFunctions => {
				unsubscribeFunctions.forEach(unsubscribe => {
					unsubscribers.push(unsubscribe)
				})
			})

		return () => {
			unsubscribers.forEach(unsubscribe => unsubscribe())
		}
	}, [])
}
