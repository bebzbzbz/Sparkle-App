import { useNavigate } from "react-router-dom";

interface MainButtonProps {
	textContent: string,
	type: "button" | "submit",
	linkDestination?: string,
	action?: () => void,
	icon?: string
}

const MainButton = ({ textContent, linkDestination, action, type, icon }: MainButtonProps) => {
	const navigate = useNavigate()

	return (
		<button
			type={type}
			className="bg-main px-5 py-2 rounded-full text-white font-semibold tracking-[2px] cursor-pointer flex gap-3 justify-center"
			onClick={() => {
                if (linkDestination) {
                    navigate(`/${linkDestination}`);
                } else if (action) {
                    action();
                }
            }}
		>
			{icon && <img src={`/svg/${icon}.svg`} alt="Profile Icon" />
		}
			{textContent}
		</button>
	);
}

export default MainButton;
