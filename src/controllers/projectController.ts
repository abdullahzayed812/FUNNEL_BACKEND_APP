import { ProjectModel } from "../models/projectModel";
import { ExpressHandler } from "../types/apis";
import { AppError } from "../configs/error";

export class ProjectController {
  private projectModel: ProjectModel;

  constructor(projectModel: ProjectModel) {
    this.projectModel = projectModel;
  }

  listProjects: ExpressHandler = async (_, res) => {
    try {
      const projects = await this.projectModel.list(res.locals.userId);
      res.status(200).send({ projects });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "An unexpected error occurred" });
      }
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
      res.status(200).send({ result });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "An unexpected error occurred" });
      }
    }
  };
}
