import { useRef, useState } from "react";

export function useOneShotToggle(initial: boolean) {
	const [value, setValue] = useState(initial);
	const usedRef = useRef(false);

	const toggleOnce = () => {
		if (usedRef.current) {
			return;
		}
		usedRef.current = true;
		setValue((v) => !v);
	};

	return [value, toggleOnce] as const;
}
