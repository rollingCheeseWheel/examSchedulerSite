import obj from "./endpoints";

export default {
	baseApiPath: "/api/v1",
	schoolDropdown: () => mergePaths("signup/schools"),
};

function mergePaths(path: string) {
	return obj.baseApiPath + (path.startsWith("/") ? "" : "/") + path;
}
