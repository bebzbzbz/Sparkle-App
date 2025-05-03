import { JSX } from "react";
import { useNavigate } from "react-router-dom";

interface HeaderIcon {
	name:JSX.Element,
	onClick?: () => void;
}

interface HeaderProps {
	headerTitle: string,
	imgLeft: JSX.Element,
	leftLinkDestination?: string,
	leftAction?: () => void,
	iconsRight?: HeaderIcon[];
}

const Header = ({ headerTitle, imgLeft, leftLinkDestination, leftAction, iconsRight = [] }: HeaderProps) => {
	const navigate = useNavigate();

	return (
		<header
			className="px-3 pt-5 pb-8 flex justify-between items-center w-full bg-white text-text">
			<h1
				className={`flex items-center gap-2 text-text text-5xl ${leftLinkDestination && "cursor-pointer"}`}
				onClick={() => {
					// wenn eine aktion übergeben wurde, wird diese auslöst, ansonsten geschieht nichts
					if (leftLinkDestination) {
						navigate(`/${leftLinkDestination}`)
					} else if (leftAction) {
						leftAction()
					}
				}}>
				<div className="w-8 text-icon">
					{imgLeft}
				</div>
				{headerTitle}
			</h1>
			<div className="flex gap-4 items-center text-icon">
				{iconsRight.map((icon) => (
					<div key= {crypto.randomUUID()}
					className={`${icon.onClick && "cursor-pointer"} w-7 h-9 mix-blend-exclusion`}
					onClick={icon.onClick}>
						{icon.name}
					</div>
				))}
			</div>
		</header>
	);
}

export default Header;
