import { AppError } from "../configs/error";
import { ProjectService } from "../services/projectService";
import { ExpressHandler } from "../types/apis";

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  listProjectsController: ExpressHandler = async (_, res) => {
    try {
      const projects = await this.projectService.listProjects(res.locals.userId);

      res.status(200).send({ projects });
    } catch (error: any) {
      if (error instanceof AppError) {
        res.status(error.statusCode).send({ error: error.message });
      } else {
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  };
}
