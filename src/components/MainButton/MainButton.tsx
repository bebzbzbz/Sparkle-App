import { useNavigate } from "react-router-dom";

interface MainButtonProps {
	textContent: string,
	type: "button" | "submit",
	linkDestination?: string,
	action?: () => {}
}

const MainButton = ({ textContent, linkDestination, action, type }: MainButtonProps) => {
	const navigate = useNavigate()

	return (
		<button
			type={type}
			className="bg-main px-15 py-3 rounded-full text-white font-semibold tracking-[2px] cursor-pointer"
			onClick={() => {
				// je nachdem welcher oder überhaupt falls ein optionaler props-wert vergeben wird, ändert sich die funktion zwischen einer weiterleitung oder einer aktion
				if (!!linkDestination) {
					navigate(`/${linkDestination}`)
				}
				if (!!action) {
					action
				}
			}}
		>
			{textContent}
		</button>
	);
}

export default MainButton;
