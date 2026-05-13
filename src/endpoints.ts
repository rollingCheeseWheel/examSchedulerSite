const baseApiPath = "api";

function join(...parts: string[]) {
	parts = [baseApiPath, ...parts];
	return parts
		.map((p) => p.split(/^\/|\/$/g))
		.flat()
		.join("/");
}

export const endpoints = {
	schools: join("schools"),
	auth: {
		login: join("auth", "login"),
		refresh: join("auth", "refresh"),
		me: join("auth", "me")
	},
	classrooms: join("classroom", "all"),
	scheduleHub: join("hubs", "schedule"),
};
