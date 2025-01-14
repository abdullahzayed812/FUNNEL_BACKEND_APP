export var Endpoints;
(function (Endpoints) {
    Endpoints["healthz"] = "healthz";
    Endpoints["signIn"] = "signIn";
    Endpoints["signUp"] = "signUp";
    Endpoints["listUsers"] = "listUsers";
    Endpoints["listForwardedUsers"] = "listForwardedUsers";
    Endpoints["listProjects"] = "listProjects";
    Endpoints["forwardProject"] = "forwardProject";
    Endpoints["createProject"] = "createProject";
    Endpoints["getBranding"] = "getBranding";
    Endpoints["updateBranding"] = "updateBranding";
    Endpoints["listImages"] = "listImages";
    Endpoints["uploadImage"] = "uploadImage";
    Endpoints["updateImageSelectionStatus"] = "updateImageSelectionStatus";
    Endpoints["deleteImage"] = "deleteImage";
    Endpoints["createTemplate"] = "createTemplate";
    Endpoints["listDefaultTemplates"] = "listDefaultTemplates";
    Endpoints["listCustomizedTemplates"] = "listCustomizedTemplates";
    Endpoints["updateTemplateSelectionStatus"] = "updateTemplateSelectionStatus";
    Endpoints["deleteTemplate"] = "deleteTemplate";
    Endpoints["getGeneratedVisuals"] = "getGeneratedVisuals";
})(Endpoints || (Endpoints = {}));
export const ENDPOINT_CONFIGS = {
    [Endpoints.healthz]: { method: "get", url: "/api/v1/healthz" },
    [Endpoints.listUsers]: { method: "get", url: "/api/v1/users", sensitive: true },
    [Endpoints.listForwardedUsers]: {
        method: "get",
        url: "/api/v1/users/:projectId",
        sensitive: true,
        requireProjectId: true,
    },
    [Endpoints.signIn]: { method: "post", url: "/api/v1/signIn", sensitive: true },
    [Endpoints.signUp]: { method: "post", url: "/api/v1/signUp", sensitive: true },
    [Endpoints.listProjects]: { method: "get", url: "/api/v1/projects", auth: true },
    [Endpoints.forwardProject]: {
        method: "post",
        url: "/api/v1/forward-project/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.createProject]: {
        method: "post",
        url: "/api/v1/create-project",
        auth: true,
    },
    [Endpoints.getBranding]: {
        method: "get",
        url: "/api/v1/project-branding/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.updateBranding]: {
        method: "patch",
        url: "/api/v1/project-branding/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.listImages]: {
        method: "get",
        url: "/api/v1/project-images/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.uploadImage]: {
        method: "post",
        url: "/api/v1/upload-image/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.deleteImage]: {
        method: "delete",
        url: "/api/v1/project-images/:projectId",
        auth: true,
        requireImageId: true,
        requireProjectId: true,
    },
    [Endpoints.updateImageSelectionStatus]: {
        method: "patch",
        url: "/api/v1/project-images/:projectId",
        auth: true,
        requireProjectId: true,
        requireImageId: true,
    },
    [Endpoints.createTemplate]: {
        method: "post",
        url: "/api/v1/project-templates/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.listDefaultTemplates]: {
        method: "get",
        url: "/api/v1/project-templates/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.listCustomizedTemplates]: {
        method: "get",
        url: "/api/v1/project-customized-templates/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.updateTemplateSelectionStatus]: {
        method: "patch",
        url: "/api/v1/project-templates/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.deleteTemplate]: {
        method: "delete",
        url: "/api/v1/project-templates/:projectId",
        auth: true,
        requireProjectId: true,
    },
    [Endpoints.getGeneratedVisuals]: {
        method: "get",
        url: "/api/v1/generated-visuals/:projectId",
        auth: true,
        requireProjectId: true,
    },
};
