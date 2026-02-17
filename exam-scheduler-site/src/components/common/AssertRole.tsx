import { Navigate } from "react-router-dom";
import type { UserRole } from "../../models/enums";
import { useUserProfile } from "../../zustand/zustand";

export function AssertRole(props: { role: UserRole }) {
	const userRole = useUserProfile((s) => s.data?.role);

	if (!userRole) {
		return <Navigate to="/" />;
	} else if (userRole !== props.role) {
		return <Navigate to="/" />;
	} else {
		return;
	}
}
