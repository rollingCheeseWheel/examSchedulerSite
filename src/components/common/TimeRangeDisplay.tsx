import { TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { formatDateTime } from "../../util";

export function TimeRangeDisplay(props: {
	startDate?: string | Date;
	endDate?: string | Date;
	format?: Intl.DateTimeFormatOptions;
}) {
	const { i18n } = useTranslation();

	return (
		<TextInput
			value={`${
				props.startDate ?
					formatDateTime(new Date(props.startDate), i18n.language, props.format)
				:	"--:--"
			} - ${
				props.endDate ?
					formatDateTime(new Date(props.endDate), i18n.language, props.format)
				:	"--:--"
			}`}
		/>
	);
}
