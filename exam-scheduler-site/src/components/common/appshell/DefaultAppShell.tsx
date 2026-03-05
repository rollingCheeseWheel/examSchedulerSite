import { Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Routes } from "react-router-dom";
import { useIsTeacher } from "../../../zustand/zustand";
import { ScheduleCreateModal } from "../../teacher/schedule-create/ScheduleCreateModal";
import { AuthCallback } from "../auth/AuthCallback";
import { AppShellSpine } from "./AppShellSpine";

export function DefaultAppShell(props: {
	children: ReactNode;
	authDisabled?: boolean;
}) {
	const { t } = useTranslation();
	const isTeacher = useIsTeacher();
	const [modalOpen, { open, close }] = useDisclosure(false);

	return (
		<>
			<AppShellSpine>
				<AuthCallback disabled={props.authDisabled}></AuthCallback>
				<Routes>{props.children}</Routes>
			</AppShellSpine>
			{isTeacher && (
				<>
					<ScheduleCreateModal opened={modalOpen} close={close} />
					<Group onClick={open}>
						<Button size="lg" pos="fixed" bottom={16} right={16}>
							{t("schedule.create.createbutton")}
						</Button>
						<IconPlus />
					</Group>
				</>
			)}
		</>
	);
}
