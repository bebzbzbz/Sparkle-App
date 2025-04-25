import { useNavigate } from "react-router-dom";

interface HeaderProps {
	headerTitle: string,
	imgLeft: string,
	leftLinkDestination?: string,
	leftAction?: () => void,
	imgRight1?: string,
	rightAction1?: () => void,
	imgRight2?: string,
	rightAction2?: () => void,
	imgRight3?: string,
	rightAction3?: () => void,
	onImgRight3Click?: () => void
}

const Header = ({ headerTitle, imgLeft, leftLinkDestination, leftAction, imgRight1, imgRight2, imgRight3, rightAction1, rightAction2, rightAction3, onImgRight3Click }: HeaderProps) => {
	const navigate = useNavigate();

	return (
		<header
			className="fixed top-0 left-0 px-5 pt-6 pb-4 flex justify-between items-center w-full bg-white">
			<h1
				className={`flex items-center gap-3 font-bold text-lg ${leftLinkDestination && "cursor-pointer"}`}
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
			<div
				className="flex gap-5">
				{imgRight1 &&
					<img
						src={`/svg/${imgRight1}.svg`}
						alt="Likes"
						className={`${rightAction1 && "cursor-pointer"} w-6`}
						onClick={rightAction1} />}
				{imgRight2 &&
					<img
						src={`/svg/${imgRight2}.svg`}
						alt="Likes"
						className={`${rightAction2 && "cursor-pointer"} w-6`}
						onClick={rightAction2} />}
				{imgRight3 &&
					<img
						src={`/svg/${imgRight3}.svg`}
						alt="Likes"
						className={`${rightAction3 && "cursor-pointer"} w-6`}
						onClick={onImgRight3Click} />}
			</div>
		</header>
	);
}

export default Header;
