// Module imports
import { useEffect } from 'react'





// Local imports
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
}
