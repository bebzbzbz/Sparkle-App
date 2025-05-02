import { useEffect, useState } from "react";

const useDarkMode = () => {
	const [isDark, setIsDark] = useState(() => {
		if (typeof window === "undefined") return false;
		return localStorage.getItem("theme") === "dark";
	});

	useEffect(() => {
		const body = document.body;

		// Übergang nur nach erstem Mount erlauben
		const timeout = setTimeout(() => {
			body.classList.add("theme-transition");
		}, 0);

		if (isDark) {
			body.classList.add("dark-mode");
			localStorage.setItem("theme", "dark");
		} else {
			body.classList.remove("dark-mode");
			localStorage.setItem("theme", "light");
		}

		return () => clearTimeout(timeout);
	}, [isDark]);

	return [isDark, setIsDark] as const;
};

export default useDarkMode;
