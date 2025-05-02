import { useNavigate } from "react-router-dom";

interface HeaderIcon {
	name: string; // z.B. "heart", "newpost", "comment"
	onClick?: () => void;
	alt?: string;
}

interface HeaderProps {
	headerTitle: string,
	imgLeft: string,
	leftLinkDestination?: string,
	leftAction?: () => void,
	iconsRight?: HeaderIcon[];
}

const Header = ({ headerTitle, imgLeft, leftLinkDestination, leftAction, iconsRight = [] }: HeaderProps) => {
	const navigate = useNavigate();

	return (
		<header
			className="absolute top-0 left-0 px-4 pt-5 pb-7 flex justify-between items-center w-full bg-[var(--text-color)]">
			<h1
				className={`flex items-center gap-3 font-bold text-[var(--bg-color)] text-lg ${leftLinkDestination && "cursor-pointer"}`}
				onClick={() => {
					// wenn eine aktion übergeben wurde, wird diese auslöst, ansonsten geschieht nichts
					if (leftLinkDestination) {
						navigate(`/${leftLinkDestination}`)
					} else if (leftAction) {
						leftAction()
					}
				}}>
				<img
					src={`/svg/${imgLeft}.svg`}
					alt="Logo"
					className="w-6" />
				{headerTitle}
			</h1>
			<div className="flex gap-5">
				{iconsRight.map((icon, idx) => (
					<img
						key={icon.name + idx}
						src={`/svg/${icon.name}.svg`}
						alt={icon.alt || icon.name}
						className={icon.onClick ? "cursor-pointer w-6 mix-blend-exclusion" : "w-6  mix-blend-exclusion"}
						onClick={icon.onClick}
					/>
				))}
			</div>
		</header>
	);
}

export default Header;
