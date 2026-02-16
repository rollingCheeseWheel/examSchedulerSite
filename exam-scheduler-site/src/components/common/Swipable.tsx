import type { ReactNode } from "react";
import { useSwipeable, type SwipeableProps } from "react-swipeable";

export function Swipable({
	children,
	swipeableProps,
}: {
	children: ReactNode;
	swipeableProps: SwipeableProps;
}) {
	const handlers = useSwipeable(swipeableProps);
	return <div {...handlers}>{children}</div>;
}
