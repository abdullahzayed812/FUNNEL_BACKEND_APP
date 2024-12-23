import { ProjectService } from "../services/projectService";
import { ExpressHandler } from "../types/apis";

export class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  listProjectsController: ExpressHandler = async (_, res) => {
    try {
      const result = await this.projectService.listProjects(res.locals.userId);

      res.status(200).send({ projects: result });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };

  getProjectDataController: ExpressHandler = async (req, res) => {
    try {
      const { id } = req.params;

      const { images, templates, branding } = await this.projectService.getProjectData(id, res.locals.userId);

      res.status(200).send({ images, templates, branding });
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };
}
