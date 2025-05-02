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
			className="absolute top-0 left-0 px-4 pt-5 pb-7 flex justify-between items-center w-full bg-[var(--text-color)] text-icon">
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
				<div className="w-6">
					{imgLeft}
				</div>
				{headerTitle}
			</h1>
			<div className="flex gap-5">
				{iconsRight.map((icon) => (
					<div key= {crypto.randomUUID()}
					className={icon.onClick ? "cursor-pointer w-6 mix-blend-exclusion" : "w-6  mix-blend-exclusion"}
					onClick={icon.onClick}>
						{icon.name}
					</div>
				))}
			</div>
		</header>
	);
}

export default Header;
