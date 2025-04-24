import { useNavigate } from "react-router-dom";

interface MainButtonProps {
	textContent: string,
	type: "button" | "submit",
	linkDestination?: string,
	action?: () => void
}

const MainButton = ({ textContent, linkDestination, action, type }: MainButtonProps) => {
	const navigate = useNavigate()

	return (
		<button
			type={type}
			className="bg-main px-15 py-3 rounded-full text-white font-semibold tracking-[2px] cursor-pointer"
			onClick={() => {
                if (linkDestination) {
                    navigate(`/${linkDestination}`);
                } else if (action) {
                    action();
                }
            }}
		>
			{textContent}
		</button>
	);
}

export default MainButton;
