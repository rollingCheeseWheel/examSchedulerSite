import {
	Box,
	Center,
	Container,
	type MantineColor,
	SimpleGrid,
	Text,
} from "@mantine/core";
import {
	groupBy,
	mapKVPs,
	reduceMap,
	timeTableSlotSorter,
} from "../../../util";
import type { DayOfWeek } from "./../../../models/calendar";

export interface TimeTableSlot {
	dayOfWeek: DayOfWeek;
	start: number;
	duration: number;
	name: string;
	color: MantineColor;
}

export function TimeTable(props: { slots: TimeTableSlot[] }) {
	const groupedDays = mapKVPs(
		groupBy(props.slots, (s) => s.dayOfWeek),
		(slots) => slots.sort(timeTableSlotSorter),
	);
	const longestDay = Math.max(
		...reduceMap(groupedDays, (acc, curr) => acc + curr.duration, 0).values(),
	);
	const percentHeightPerHour = 100 / longestDay;
	const percentWidthPerDay = `${100 / groupedDays.size}%`;

	return (
		<SimpleGrid
			cols={groupedDays.size}
			h="100%"
			w="100%"
			pos="relative"
			spacing={0}>
			{Array.from(
				mapKVPs(groupedDays, (slots) => (
					<Container>
						{slots.map((s) => (
							<Box
								pos="absolute"
								top={`${s.start * percentHeightPerHour}%`}
								bg={s.color}
								h={`${s.duration * percentHeightPerHour}%`}
								w={percentWidthPerDay}>
								<Center>
									<Text truncate="end">{s.name}</Text>
								</Center>
							</Box>
						))}
					</Container>
				)).values(),
			)}
		</SimpleGrid>
	);
}
