import type { OverlayProps, TransitionProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createContext, useContext, type ReactNode } from "react";

interface LoadingOverlayContextType {
	state: boolean;
	setState: (b: boolean) => void;
	toggle: () => void;
	open: () => void;
	close: () => void;
	props: {
		overlayProps: OverlayProps;
		transitionProps?: TransitionProps;
		zIndex: string | number;
	};
}

const props: {
	overlayProps: OverlayProps;
	transitionProps?: TransitionProps;
	zIndex: string | number;
} = {
	overlayProps: {
		blur: 4,
	},
	zIndex: 6767,
};

const LoadingOverlayContext = createContext<
	LoadingOverlayContextType | undefined
>(undefined);

export function LoadingOverlayProvider({ children }: { children: ReactNode }) {
	const [state, { close, open, toggle }] = useDisclosure(false);

	function setState(b: boolean) {
		if (b) {
			open();
		} else {
			close();
		}
	}

	const exported = {
		state,
		setState,
		close,
		open,
		toggle,
		props,
	};

	return (
		<LoadingOverlayContext.Provider value={exported}>
			{children}
		</LoadingOverlayContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoadingOverlay() {
	const ctx = useContext(LoadingOverlayContext);
	if (!ctx)
		throw new Error(
			"useLoadingOverlay can only be used inside a LoadingOverlayProvider"
		);
	return ctx;
}
