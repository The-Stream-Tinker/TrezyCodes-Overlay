// Module imports
import cors from 'micro-cors'





// Local imports
import httpStatus from './httpStatus.js'






// Local constants
const DEFAULT_MIDDLEWARES = [cors({
	origin: (() => {
		if (process.env.VERCEL_ENV === 'production') {
			return 'https://trezy.stream'
		}

		return '*'
	})(),
})]





const createEndpoint = options => {
	const {
		handler: initialHandler,
		allowedMethods,
		middlewares = [],
	} = options

	const allMiddlewares = [
		...DEFAULT_MIDDLEWARES,
		...middlewares,
	]

	const wrappedHandler = allMiddlewares.reduce(
		(handler, middleware) => middleware(handler),
		initialHandler,
	)

	return (req, res) => {
		if (allowedMethods && !allowedMethods.includes(req.method.toLowerCase())) {
			return res.status(httpStatus.METHOD_NOT_ALLOWED).end()
		}

		return wrappedHandler(req, res)
	}
}





export default createEndpoint
