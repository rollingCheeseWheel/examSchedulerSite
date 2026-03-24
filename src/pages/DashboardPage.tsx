import { Route } from "react-router-dom";
import { DefaultAppShell } from "../components/common/appshell/DefaultAppShell";
import { ScheduleWidget } from "../components/common/schedule/ScheduleWidget";

export function DashboardPage() {
	return (
		<DefaultAppShell>
			<Route path="/" element={<ScheduleWidget maxwidth="600px" />} />
		</DefaultAppShell>
	);
}
