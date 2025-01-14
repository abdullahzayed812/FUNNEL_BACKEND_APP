export function validateProjectId(projectId) {
    if (!projectId) {
        throw new Error("Project ID is required");
    }
    if (typeof projectId !== "string" || projectId.trim() === "") {
        throw new Error("Project ID must be a non-empty string");
    }
    return true;
}
export function validateImageId(imageId) {
    if (!imageId) {
        throw new Error("Project ID is required");
    }
    if (typeof imageId !== "string" || imageId.trim() === "") {
        throw new Error("Project ID must be a non-empty string");
    }
    return true;
}
