import { useState } from "react";

export function useToggle(initial: boolean) {
	const [state, setToggle] = useState(initial);

	const toggle = () => setToggle(!state);
	const reset = () => setToggle(initial);

	return { state, toggle, setToggle, reset };
}
