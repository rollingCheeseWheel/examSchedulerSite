import {
	ActionIcon,
	Box,
	Button,
	Center,
	Collapse,
	Divider,
	Flex,
	Grid,
	Group,
	HoverCard,
	Kbd,
	Notification,
	Paper,
	Stack,
	Text,
	Title,
	type StyleProp,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import {
	IconCheck,
	IconChevronRight,
	IconReplaceUser,
	IconTrashFilled,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useIgnoredSwapRequests } from "../../../hooks/useIgnoredSwapRequests";
import { usePromise } from "../../../hooks/usePromise";
import { useToggle } from "../../../hooks/useToggle";
import {
	useHubConnection,
	useIsTeacher,
	useUserProfile
} from "../../../hooks/zustand";
import type { ExamSlot, ExamSlotId, Schedule } from "../../../models/schedule";
import type { SwapRequest, SwapRequestId } from "../../../models/swapRequest";
import type { UserProfile } from "../../../models/user";
import { formatDateTime, type Action } from "../../../util";
import { ReportStudentModal } from "../../teacher/report-actual-students/StudentReportModal";
import { ScheduleProgress } from "./ExtendedProgessbar";

export function ExamSchedule(props: {
	schedule: Schedule;
	selectedSlotId?: ExamSlotId;
	maxwidth?: StyleProp<string | number>;
}) {
	const { t } = useTranslation();
	const connection = useHubConnection((s) => s.data);
	const { resolve } = usePromise({
		onError: useMemo(
			() => [
				() =>
					notifications.show({
						message: t("common.error"),
					}),
				console.error,
			],
			[t],
		),
		onSuccess: useMemo(
			() => [
				() =>
					notifications.show({
						message: t("common.success"),
					}),
				console.log,
			],
			[t],
		),
	});

	const joinSlot = useCallback(
		(id: ExamSlotId) => resolve(connection?.registerForSlot(id)),
		[connection, resolve],
	);
	const createSwapRequest = useCallback(
		(id: ExamSlotId) =>
			resolve(connection?.createSwapRequest(props.schedule.id, id)),
		[connection, props.schedule.id, resolve],
	);
	const acceptSwapRequest = useCallback(
		(id: SwapRequestId) => resolve(connection?.acceptSwapRequest(id)),
		[connection, resolve],
	);
	const deleteSwapRequest = useCallback(
		(id: SwapRequestId) => resolve(connection?.deleteSwapRequest(id)),
		[connection, resolve],
	);

	return (
		<Paper
			maw={props.maxwidth}
			withBorder
			radius="md"
			key={props.schedule.id}
			id={props.schedule.id}>
			<Box pos="relative" p="md">
				<Group justify="space-between">
					<Stack>
						<Title order={2}>{props.schedule.subject.name}</Title>
						{props.schedule.description && (
							<Text ta="right">{props.schedule.description}</Text>
						)}
					</Stack>
					{useIsTeacher() && (
						<HoverCard>
							<HoverCard.Target>
								<ActionIcon
									onClick={() => {
										resolve(connection?.deleteSchedule(props.schedule.id));
									}}>
									<IconTrashFilled />
								</ActionIcon>
							</HoverCard.Target>
							<HoverCard.Dropdown>{t("schedule.delete")}</HoverCard.Dropdown>
						</HoverCard>
					)}
				</Group>

				<Stack align="stretch" justify="flex-start" gap="xs">
					{...props.schedule.examSlots.map((s, i, arr) => (
						<>
							<ScheduleDate
								schedule={props.schedule}
								slot={s}
								selectedSlotId={props.selectedSlotId}
								selectSlot={joinSlot}
								createSwapRequest={createSwapRequest}
								acceptSwapRequest={acceptSwapRequest}
								deleteSwapRequest={deleteSwapRequest}
							/>
							{i != arr.length - 1 && <Divider />}
						</>
					))}
				</Stack>
			</Box>
		</Paper>
	);
}

function ScheduleDate(props: {
	schedule: Schedule;
	slot: ExamSlot;
	selectedSlotId?: ExamSlotId;
	selectSlot: Action<[ExamSlotId]>;
	createSwapRequest: Action<[ExamSlotId]>;
	acceptSwapRequest: Action<[SwapRequestId]>;
	deleteSwapRequest: Action<[SwapRequestId]>;
}) {
	const { i18n } = useTranslation();
	const { ignoredIds, ignore } = useIgnoredSwapRequests();

	const thisSlotsSwapRequest = props.schedule.swapRequests.filter(
		(sr) => sr.requestedSlotId === props.slot.id && !ignoredIds.includes(sr.id),
	);

	return (
		<>
			<Grid align="center">
				<Grid.Col span={4}>
					<Text>
						{formatDateTime(new Date(props.slot.date), i18n.language)}
					</Text>
				</Grid.Col>
				<Grid.Col span="auto">
					<ScheduleProgress
						participants={props.slot.participants.length}
						min={props.slot.minParticipants}
						max={props.slot.maxParticipants}
						size="xl"
					/>
				</Grid.Col>
				<Grid.Col span="content">
					{props.slot.id !== props.selectedSlotId && (
						<SlotSelectButton
							slot={props.slot}
							currentSelectedSlotId={props.selectedSlotId}
							select={props.selectSlot}
							createSwap={props.createSwapRequest}
						/>
					)}
				</Grid.Col>
			</Grid>
			<Group gap="xs">
				{...props.slot.participants.map(ScheduleParticipant)}
			</Group>
			{thisSlotsSwapRequest.length != 0 && props.slot.lockState === "open" && (
				<SwapRequestDrawer
					swaprequests={thisSlotsSwapRequest}
					accept={props.acceptSwapRequest}
					delete={props.deleteSwapRequest}
					ignore={ignore}
				/>
			)}
		</>
	);
}

function ScheduleParticipant(user: UserProfile) {
	return <Kbd variant="default">{user.name}</Kbd>;
}

function SlotSelectButton(props: {
	slot: ExamSlot;
	currentSelectedSlotId?: ExamSlotId;
	select: Action<[ExamSlotId]>;
	createSwap: Action<[ExamSlotId]>;
}) {
	const { t } = useTranslation();
	const isTeacher = useIsTeacher();
	const [
		studentModalOpen,
		{ open: openStudentModal, close: closeStudentModal },
	] = useDisclosure(false);

	const isInSwapState =
		props.slot.participants.length >= props.slot.maxParticipants;

	if (isTeacher && props.slot.lockState === "locked") {
		return (
			<>
				<ReportStudentModal
					slotId={props.slot.id}
					opened={studentModalOpen}
					onClose={closeStudentModal}
				/>
				<Button onClick={openStudentModal}>{t("schedule.reportactual")}</Button>
			</>
		);
	} else if (isTeacher || props.slot.lockState === "definite") {
		return;
	}

	return (
		<Button
			onClick={() =>
				(isInSwapState ? props.createSwap : props.select)(props.slot.id)
			}
			rightSection={isInSwapState ? <IconReplaceUser /> : <IconCheck />}
			variant={isInSwapState ? "light" : "filled"}>
			{isInSwapState ? t("schedule.swap") : t("schedule.register")}
		</Button>
	);
}

function SwapRequestDrawer(props: {
	swaprequests: SwapRequest[];
	accept: Action<[SwapRequestId]>;
	delete: Action<[SwapRequestId]>;
	ignore: Action<[SwapRequestId]>;
}) {
	const isTeacher = useIsTeacher();
	const { state, toggle } = useToggle(false);
	const { t } = useTranslation();

	if (isTeacher) {
		return;
	}

	return (
		<Notification
			color="gray"
			onClick={toggle}
			withCloseButton={false}
			title={
				<Group>
					<Title order={4}>{t("swaprequests.title")}</Title>
					<IconChevronRight
						style={{
							transition: "transform 200ms ease",
							transform: state ? "rotate(90deg)" : "none",
						}}
					/>
				</Group>
			}>
			<Collapse in={state}>
				<Flex gap="md" wrap="wrap">
					{...props.swaprequests.map((sr) => (
						<SwapRequestItem
							swapRequest={sr}
							accept={props.accept}
							delete={props.delete}
						/>
					))}
				</Flex>
			</Collapse>
		</Notification>
	);
}

function SwapRequestItem(props: {
	swapRequest: SwapRequest;
	accept: Action<[SwapRequestId]>;
	delete: Action<[SwapRequestId]>;
}) {
	const { t } = useTranslation();
	const userId = useUserProfile((s) => s.data?.id);

	return (
		<Group>
			<Button
				// size="compact-sm"
				variant={
					userId === props.swapRequest.requestingStudentId ? "default" : "light"
				}
				onClick={(e) => {
					e.stopPropagation();
					(userId === props.swapRequest.requestingStudentId ?
						props.delete
					:	props.accept)(props.swapRequest.id);
				}}
				leftSection={
					<Center>
						<Text size="md">{props.swapRequest.requestingStudentName}</Text>
					</Center>
				}
				rightSection={
					userId === props.swapRequest.requestingStudentId ?
						<IconX />
					:	<IconCheck />
				}>
				{userId === props.swapRequest.requestingStudentId ?
					t("swaprequest.delete")
				:	t("swaprequest.accept")}
			</Button>
		</Group>
	);
}
