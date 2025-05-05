import { useNavigate } from "react-router-dom";

interface MainButtonProps {
  textContent: string;
  type: "button" | "submit";
  linkDestination?: string;
  onClick?: () => void;
  icon?: string;
  disabled?: boolean;
}

const MainButton = ({
  textContent,
  linkDestination,
  onClick,
  type,
  icon,
  disabled,
}: MainButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;

    if (onClick) {
      onClick();
    } else if (linkDestination) {
      navigate(`/${linkDestination}`);
    }
  };

  return (
    <button
      type={type}
      className={`bg-main px-5 py-2 rounded-full text-light font-semibold tracking-[2px] cursor-pointer flex gap-3 justify-center ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-opacity-80"
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <img src={`/svg/follow.svg`} alt="Button Icon" />}
      {textContent}
    </button>
  );
};

export default MainButton;
