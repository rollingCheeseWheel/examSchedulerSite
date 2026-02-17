import {
	Button,
	Center,
	Collapse,
	Divider,
	Flex,
	Grid,
	Group,
	Kbd,
	LoadingOverlay,
	Notification,
	Paper,
	Stack,
	Text,
	Title,
	type StyleProp,
} from "@mantine/core";
import {
	IconCheck,
	IconChevronRight,
	IconReplaceUser,
	IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useIgnoredSwapRequests } from "../../../hooks/useIgnoredSwapRequests";
import { usePromise } from "../../../hooks/usePromise";
import { useToggle } from "../../../hooks/useToggle";
import type { Result } from "../../../models/result";
import type { ExamSlot, ExamSlotId, Schedule } from "../../../models/schedule";
import type { SwapRequest, SwapRequestId } from "../../../models/swapRequest";
import type { UserProfile, UserProfileId } from "../../../models/user";
import { formatDateTime, type Action } from "../../../util";
import {
	useIsTeacher,
	useScheduleHubConnection,
	useUserProfile,
} from "../../../zustand/zustand";
import { ScheduleProgress } from "./ExtendedProgessbar";
import { ReportStudentModal } from "../../teacher/report-actual-students/StudentReportPopOver";
import { useDisclosure } from "@mantine/hooks";

export function ExamSchedule(props: {
	schedule: Schedule;
	selectedSlotId?: ExamSlotId;
	maxwidth?: StyleProp<string | number>;
}) {
	const hubConnection = useScheduleHubConnection((s) => s.data);
	const { loading, resolve } = usePromise<Result<boolean>>();

	const joinSlot = (id: ExamSlotId) =>
		resolve(hubConnection?.RegisterForSlot(id));
	const createSwapRequest = (id: ExamSlotId) =>
		resolve(hubConnection?.CreateSwapRequest(props.schedule.id, id));
	const acceptSwapRequest = (id: SwapRequestId) =>
		resolve(hubConnection?.AcceptSwapRequest(id));
	const deleteSwapRequest = (id: SwapRequestId) =>
		resolve(hubConnection?.DeleteSwapRequest(id));

	return (
		<Paper
			maw={props.maxwidth}
			withBorder
			p="md"
			radius="md"
			key={props.schedule.id}>
			{loading && <LoadingOverlay />}
			<Group justify="space-between">
				<Title order={2}>{props.schedule.subject.name}</Title>
				{props.schedule.description && (
					<Text>{props.schedule.description}</Text>
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
		(sr) =>
			sr.requestedSlotId === props.slot.id && !ignoredIds.includes(sr.id),
	);

	return (
		<>
			<Grid align="center">
				<Grid.Col span={4}>
					<Text>
						{formatDateTime(props.slot.date, i18n.language)}
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
			{thisSlotsSwapRequest.length != 0 &&
				props.slot.lockState === "open" && (
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
	const canActualStudentsBeReported = props.slot.lockState === "locked";
	const [
		studentModalOpen,
		{ open: openStudentModal, close: closeStudentModal },
	] = useDisclosure(false);

	const isInSwapState =
		props.slot.participants.length >= props.slot.maxParticipants;

	if (isTeacher && canActualStudentsBeReported) {
		return (
			<>
				<ReportStudentModal
					slotId={props.slot.id}
					opened={studentModalOpen}
					onClose={closeStudentModal}
				/>
				<Button onClick={openStudentModal}>
					{t("schedule.reportactual")}
				</Button>
			</>
		);
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
					userId === props.swapRequest.requestingStudentId ?
						"default"
					:	"light"
				}
				onClick={(e) => {
					e.stopPropagation();
					(userId === props.swapRequest.requestingStudentId ?
						props.delete
					:	props.accept)(props.swapRequest.id);
				}}
				leftSection={
					<Center>
						<Text size="md">
							{props.swapRequest.requestingStudentName}
						</Text>
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
