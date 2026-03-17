import { useLocalStorage } from "@mantine/hooks";
import type { SwapRequest, SwapRequestId } from "../models/swapRequest";

export function useIgnoredSwapRequests() {
	const [values, setValues, reset] = useLocalStorage<SwapRequestId[]>({
		key: "ignoredSwapRequestIds",
		defaultValue: [],
		sync: true,
		deserialize: (value) => (value ? JSON.parse(value) : []) as SwapRequestId[],
		serialize: (value) => JSON.stringify(value),
	});

	function ignore(...requests: SwapRequest[] | SwapRequestId[]) {
		setValues((p) =>
			p.concat(requests.map((sr) => (typeof sr === "string" ? sr : sr.id))),
		);
	}

	return { ignoredIds: values, ignore, reset };
}
