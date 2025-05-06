import "./Intro.css"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Intro() {
	const navigate = useNavigate()

	useEffect(() => {
		const timer = setTimeout(() => {
			navigate("/login")
		}, 5000)

		return () => clearTimeout(timer)
	}, [navigate])

	return (
		<div className="intro-container mt-0 h-screen">
			<div className="sparkle-wrapper">
				<img className="star-medium" src="/svg/star-medium.svg" alt="Star-Medium" />

				<img className="sparkle-text" src="/svg/sparkle-text.svg" alt="Sparkle-Logo" />

				<img className="star-large" src="/svg/star-medium.svg" alt="Star-large" />

				<img className="star-small" src="/svg/star-medium.svg" alt="Star-small" />
			</div>
		</div>
	)
}
