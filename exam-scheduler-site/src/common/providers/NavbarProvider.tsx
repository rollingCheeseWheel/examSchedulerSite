import { createContext, useContext, useState, type ReactNode } from "react";
import { type LinkGroupProps } from "../link/LinkGroup";

interface NavbarDataContextType {
	data?: LinkGroupProps[];
	setData: (t: LinkGroupProps[]) => void;
	append: (t: LinkGroupProps | LinkGroupProps[]) => void;
}

const NavbarDataContext = createContext<NavbarDataContextType | undefined>(
	undefined
);

export function NavbarDataProvider({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState?: LinkGroupProps[];
}) {
	const [data, setData] = useState<LinkGroupProps[]>(initialState ?? []);

	function append(t: LinkGroupProps | LinkGroupProps[]) {
		if (Array.isArray(t)) {
			setData(data.concat(t));
		} else {
			setData(data.concat([t]));
		}
	}

	return (
		<NavbarDataContext.Provider value={{ data, setData, append }}>
			{children}
		</NavbarDataContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavbar() {
	const ctx = useContext(NavbarDataContext);
	if (!ctx) throw new Error("useNavbar must be used inside a NavbarProvider");
	return ctx;
}

interface NavbarStateContextType {
	state: boolean;
	setState: (t: boolean) => void;
	toggle: () => void;
}

const NavbarStateContext = createContext<NavbarStateContextType | undefined>(
	undefined
);

export function NavbarStateProvider({
	children,
	initialState,
}: {
	children: ReactNode;
	initialState: boolean;
}) {
	const [state, setState] = useState(initialState);

	function toggle() {
		setState(!state);
	}

	return (
		<NavbarStateContext.Provider value={{ state, setState, toggle }}>
			{children}
		</NavbarStateContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNavbarState() {
	const ctx = useContext(NavbarStateContext);
	if (!ctx)
		throw new Error(
			"useNavbarState can only be used inside a NavbarStateProvider"
		);
	return ctx;
}
