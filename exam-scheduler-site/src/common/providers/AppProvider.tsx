import type { ReactNode } from "react";
import { LoadingOverlayProvider } from "./LoadingOverlayProvider";
import { NavbarDataProvider, NavbarStateProvider } from "./NavbarProvider";
import { SchoolUrlProvider } from "./SchoolUrlProvider";

// TODO mantineprovider could also be wrapped in here
export function AppProvider({
	children,
	sidebarOpenInitially,
}: {
	children: ReactNode | ReactNode[];
	sidebarOpenInitially?: boolean;
}) {
	return (
		<LoadingOverlayProvider>
			<NavbarDataProvider>
				<NavbarStateProvider
					initialState={sidebarOpenInitially ?? false}>
					<SchoolUrlProvider>
						{...[children].flat()}
					</SchoolUrlProvider>
				</NavbarStateProvider>
			</NavbarDataProvider>
		</LoadingOverlayProvider>
	);
}
