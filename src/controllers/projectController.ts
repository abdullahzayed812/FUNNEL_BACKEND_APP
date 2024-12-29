import { ProjectModel } from "../models/projectModel";
import { ExpressHandler } from "../types/apis";

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
      res.status(400).send({ error: error.message });
    }
  };
}
