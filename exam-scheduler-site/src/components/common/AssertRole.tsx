import { Navigate } from "react-router-dom";
import type { UserRole } from "../../models/enums";
import { useUserProfile } from "../../zustand/zustand";

export function AssertRole(props: { role: UserRole }) {
	const userprofile = useUserProfile((s) => s.data);

	if (!userprofile) {
		return <Navigate to="/" />;
	} else if (userprofile.role !== props.role) {
		return <Navigate to="/" />;
	} else {
		return;
	}
}
