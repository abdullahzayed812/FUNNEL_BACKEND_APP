export interface EndpointConfig {
  url: string;
  method: "get" | "post" | "patch" | "delete";
  auth?: boolean;
  sensitive?: boolean;
}

export enum Endpoints {
  healthz = "healthz",

  signIn = "signIn",
  signUp = "signUp",

  listProjects = "listProjects",
  getProjectData = "getProjectData",
  // createProject = "createProject",
  // deleteProject = "deleteProject",

  // listProjectImages = "listProjectImages",
  // uploadProjectImage = "uploadProjectImage",
  // updateProjectImageSelectionStatus = "updateProjectImageSelectionStatus",
  // deleteProjectImage = "deleteProjectImage",

  // listProjectTemplates = "listProjectTemplates",
  // addProjectTemplate = "addProjectTemplate",
  // updateProjectTemplateSelectionStatus = "updateProjectTemplateSelectionStatus",
  // deleteProjectTemplate = "deleteProjectTemplate",

  // listGeneratedVisuals = "listGeneratedVisuals",
  // deleteGenerateVisualItem = "deleteGeneratedVisualsItem",
}

export const ENDPOINT_CONFIGS: { [key in Endpoints]: EndpointConfig } = {
  [Endpoints.healthz]: { method: "get", url: "/api/v1/healthz" },

  [Endpoints.signIn]: { method: "post", url: "/api/v1/signIn", sensitive: true },
  [Endpoints.signUp]: { method: "post", url: "/api/v1/signUp", sensitive: true },

  [Endpoints.listProjects]: { method: "get", url: "/api/v1/projects", auth: true },
  [Endpoints.getProjectData]: { method: "get", url: "/api/v1/projects/:id", auth: true },
  // [Endpoints.createProject]: { method: "post", url: "/api/v1/projects", auth: true },
  // [Endpoints.deleteProject]: { method: "delete", url: "/api/v1/projects", auth: true },

  // [Endpoints.listProjectImages]: { method: "get", url: "/api/v1/project-images" },
  // [Endpoints.uploadProjectImage]: { method: "post", url: "/api/v1/project-images", auth: true },
  // [Endpoints.updateProjectImageSelectionStatus]: { method: "patch", url: "/api/v1/project-images", auth: true },
  // [Endpoints.deleteProjectImage]: { method: "delete", url: "/api/v1/project-images/:id", auth: true },

  // [Endpoints.listProjectTemplates]: { method: "get", url: "/api/v1/project-templates" },
  // [Endpoints.addProjectTemplate]: { method: "post", url: "/api/v1/project-templates", auth: true },
  // [Endpoints.updateProjectTemplateSelectionStatus]: { method: "patch", url: "/api/v1/project-templates", auth: true },
  // [Endpoints.deleteProjectTemplate]: { method: "delete", url: "/api/v1/project-templates/:id", auth: true },

  // [Endpoints.listGeneratedVisuals]: { method: "get", url: "/api/v1/generated-visuals" },
  // [Endpoints.deleteGenerateVisualItem]: { method: "delete", url: "/api/v1/generated-visuals", auth: true },
};
