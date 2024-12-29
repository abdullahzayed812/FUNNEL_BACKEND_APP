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
  listImages = "listImages",
  listTemplates = "listTemplates",
  getBranding = "getBranding",
  uploadImage = "uploadImage",
  createTemplate = "createTemplate",
  listCustomizedTemplates = "listCustomizedTemplates",
  updateBranding = "updateBranding",
  updateImageSelectionStatus = "updateImageSelectionStatus",
  deleteImage = "deleteImage",
  updateTemplateSelectionStatus = "updateTemplateSelectionStatus",
  deleteTemplate = "deleteTemplate",
}

export const ENDPOINT_CONFIGS: { [key in Endpoints]: EndpointConfig } = {
  [Endpoints.healthz]: { method: "get", url: "/api/v1/healthz" },
  [Endpoints.signIn]: { method: "post", url: "/api/v1/signIn", sensitive: true },
  [Endpoints.signUp]: { method: "post", url: "/api/v1/signUp", sensitive: true },
  [Endpoints.listProjects]: { method: "get", url: "/api/v1/projects", auth: true },
  [Endpoints.listImages]: { method: "get", url: "/api/v1/project-images/:id", auth: true },
  [Endpoints.createTemplate]: { method: "post", url: "/api/v1/project-templates/:id", auth: true },
  [Endpoints.getBranding]: { method: "get", url: "/api/v1/project-branding/:id", auth: true },
  [Endpoints.uploadImage]: { method: "post", url: "/api/v1/upload-image/:id", auth: true },
  [Endpoints.listTemplates]: { method: "get", url: "/api/v1/project-templates/:id", auth: true },
  [Endpoints.listCustomizedTemplates]: { method: "get", url: "/api/v1/project-customized-templates/:id", auth: true },
  [Endpoints.updateBranding]: { method: "patch", url: "/api/v1/project-branding/:id", auth: true },
  [Endpoints.updateImageSelectionStatus]: { method: "patch", url: "/api/v1/project-images/:id", auth: true },
  [Endpoints.deleteImage]: { method: "delete", url: "/api/v1/project-images/:id", auth: true },
  [Endpoints.updateTemplateSelectionStatus]: { method: "patch", url: "/api/v1/project-templates/:id", auth: true },
  [Endpoints.deleteTemplate]: { method: "delete", url: "/api/v1/project-templates/:id", auth: true },
};
