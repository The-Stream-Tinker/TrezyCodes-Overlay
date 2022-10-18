// Style imports
import '../scss/lib.scss'
import '../scss/app.scss'





// Module imports
import NextHead from 'next/head'





// Local imports
import { useTwitch } from '../hooks/useTwitch.js'





export default function App({ Component, pageProps }) {
	useTwitch()

  return (
    <>
			<NextHead>
				<link rel={'stylesheet'} href={'https://use.typekit.net/cle5xfy.css'} />
			</NextHead>

      <Component {...pageProps} />
    </>
  )
}
