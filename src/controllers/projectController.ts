import { ResponseHandler } from "../helpers/responseHandler";
import { ProjectModel } from "../models/projectModel";
import { ExpressHandler } from "../types/apis";

export class ProjectController {
  private projectModel: ProjectModel;

  constructor(projectModel: ProjectModel) {
    this.projectModel = projectModel;
  }

  listProjects: ExpressHandler = async (_, res) => {
    try {
      const projects = await this.projectModel.list(res.locals.userId, res.locals.role);

      ResponseHandler.handleSuccess(res, { projects });
    } catch (error: any) {
      console.log(error);
      ResponseHandler.handleError(res, error.message);
    }
  };

  forwardProject: ExpressHandler = async (req, res) => {
    const { projectId } = req.params;
    const { usersIds } = req.body;

    if (!projectId || typeof projectId !== "string") {
      return res.status(400).send({ error: "Invalid projectId" });
    }

    if (usersIds.length === 0) {
      return res.status(400).send({ error: "Users ids are required to forward" });
    }

    try {
      const result = await this.projectModel.forward(projectId, usersIds);

      ResponseHandler.handleSuccess(res, { result });
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };

  createProject: ExpressHandler = async (req, res) => {
    const { project } = req.body;

    try {
      const isCreated = await this.projectModel.create(project, res.locals.userId, res.locals.role);

      console.log(isCreated);

      ResponseHandler.handleSuccess(res, isCreated);
    } catch (error: any) {
      ResponseHandler.handleError(res, error.message);
    }
  };
}
