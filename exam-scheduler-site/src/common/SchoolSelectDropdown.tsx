import {
	NativeSelect,
	type ComboboxData,
	type NativeSelectProps,
} from "@mantine/core";
import { SchoolUrlProvider, useSchoolUrl } from "./providers/SchoolUrlProvider";

export default function SchoolSelectDropdown(props: NativeSelectProps) {
	function SchoolSelectDropdown(props: NativeSelectProps) {
		const { loading, data } = useSchoolUrl();

		return (
			<NativeSelect
				{...props}
				disabled={!loading}
				data={data as ComboboxData}
			/>
		);
	}

	return (
		<SchoolUrlProvider>
			<SchoolSelectDropdown {...props} />
		</SchoolUrlProvider>
	);
}
