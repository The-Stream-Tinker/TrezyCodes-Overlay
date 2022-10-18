// Local imports
import createEndpoint from '../../../helpers/createEndpoint.js'





// Local imports
import httpStatus from '../../../helpers/httpStatus.js'





export async function handler(request, response) {
	const accessTokenURL = new URL('/oauth2/token', 'https://id.twitch.tv')

	accessTokenURL.searchParams.append('client_id', process.env.TWITCH_CLIENT_ID)
	accessTokenURL.searchParams.append('client_secret', process.env.TWITCH_CLIENT_SECRET)
	accessTokenURL.searchParams.append('grant_type', 'client_credentials')

	const accessTokenResponse = await fetch(accessTokenURL, { method: 'post' })
	const accessTokenResponseJSON = await accessTokenResponse.json()

	const { access_token: accessToken } = accessTokenResponseJSON

	console.log(accessToken)
	const headers = {
		Accept: 'application/json',
		Authorization: `Bearer ${accessToken}`,
		'Client-Id': process.env.TWITCH_CLIENT_ID,
	}

	const results = await Promise
		.all([
			fetch(`https://api.twitch.tv/helix/chat/badges/global`, { headers }),
			fetch(`https://api.twitch.tv/helix/chat/badges/?broadcaster_id=${72632519}`, { headers }),
		])

	const [
		globalBadgeResults,
		channelBadgeResults,
	] = await Promise.all(results.map(result => result.json()))

	const badgeSetReducer = (accumulator, badgeSet) => {
		accumulator[badgeSet.set_id] = badgeSet.versions.reduce((versionAccumulator, version) => {
			versionAccumulator[version.id] = version['image_url_4x'] ?? version['image_url_2x'] ?? version['image_url_1x']
			return versionAccumulator
		}, {})

		return accumulator
	}

	response.status(httpStatus.OK).json({
		channel: channelBadgeResults.data.reduce(badgeSetReducer, {}),
		global: globalBadgeResults.data.reduce(badgeSetReducer, {}),
	})
}





export default createEndpoint({
	allowedMethods: ['get'],
	handler,
})
