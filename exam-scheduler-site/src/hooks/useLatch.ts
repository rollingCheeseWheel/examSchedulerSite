import { useRef, useState } from "react";

export function useLatch(initial: boolean) {
	const [value, setValue] = useState(initial);
	const usedRef = useRef(false);

	const latch = () => {
		if (usedRef.current) {
			return;
		}
		usedRef.current = true;
		setValue((v) => !v);
	};

	const setLatch = (v: boolean) => {
		if (usedRef.current) {
			return;
		}
		usedRef.current = true;
		setValue(v && !value);
	};

	return { value, latch, setLatch } as const;
}
