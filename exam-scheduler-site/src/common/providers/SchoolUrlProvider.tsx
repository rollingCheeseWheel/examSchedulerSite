import { useFetch } from "@mantine/hooks";
import { createContext, useContext, type ReactNode } from "react";
import endpoints from "../../endpoints";

interface SchoolUrlContextType {
	loading: boolean;
	data: UrlItem[] | null;
	error: Error | null;
	urls: () => string[];
	values: () => string[];
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	refetch: () => Promise<any>;
	abort: () => void;
}

interface UrlItem {
	label: string;
	value: string;
}

const SchoolUrlContext = createContext<SchoolUrlContextType | undefined>(
	undefined
);

export function SchoolUrlProvider({ children }: { children: ReactNode }) {
	const { data, loading, error, refetch, abort } = useFetch<UrlItem[]>(
		endpoints.schoolDropdown(),
		{ autoInvoke: true }
	);

	const urls = () => data?.map((i) => i.value) ?? [];
	const values = () => data?.map((i) => i.label) ?? [];

	const exported = {
		data,
		loading,
		error,
		refetch,
		abort,
		urls,
		values,
	};

	return (
		<SchoolUrlContext.Provider value={exported}>
			{children}
		</SchoolUrlContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSchoolUrl() {
	const ctx = useContext(SchoolUrlContext);
	if (!ctx)
		throw new Error(
			"useSchoolUrl can only be used inside a SchoolUrlProvider"
		);
	return ctx;
}
