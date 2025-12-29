export default {
	baseApiPath: "/api/v1",
	get schoolDropdown() {
		return this.get("schools");
	},

	get(...parts: string[]) {
		parts = [this.baseApiPath, ...parts];
		return parts.map((p) => p.replace(/^\/|\/$/g, "")).join("/");
	},
};
