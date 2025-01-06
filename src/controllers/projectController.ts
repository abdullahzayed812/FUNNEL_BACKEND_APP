import { ProjectModel } from "../models/projectModel";
import { ExpressHandler } from "../types/apis";
import { AppError } from "../configs/error";

export class ProjectController {
  private projectModel: ProjectModel;

  constructor(projectModel: ProjectModel) {
    this.projectModel = projectModel;
  }

  private handleError(res: any, error: any, statusCode: number = 500): void {
    console.log(error.message);
    if (error instanceof AppError) {
      res.status(statusCode).send({ error: error.message });
    } else {
      res.status(statusCode).send({ error: "Internal Server Error" });
    }
  }

  private handleSuccess(res: any, data: any, statusCode: number = 200): void {
    res.status(statusCode).send(data);
  }

  listProjects: ExpressHandler = async (_, res) => {
    try {
      const projects = await this.projectModel.list(res.locals.userId);

      this.handleSuccess(res, { projects });
    } catch (error: any) {
      this.handleError(res, error);
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

      this.handleSuccess(res, { result });
    } catch (error: any) {
      this.handleError(res, error);
    }
  };

  createProject: ExpressHandler = async (req, res) => {
    const { project } = req.body;

    try {
      const isCreated = await this.projectModel.create(project, res.locals.userId, res.locals.role);

      console.log(isCreated);

      this.handleSuccess(res, isCreated);
    } catch (error) {
      this.handleError(res, error);
    }
  };
}
