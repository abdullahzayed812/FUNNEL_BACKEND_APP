import { ProjectService } from "../services/projectService";
import { ExpressHandler } from "../types/apis";

class ProjectController {
  private projectService: ProjectService;

  constructor(projectService: ProjectService) {
    this.projectService = projectService;
  }

  listProjectsController: ExpressHandler = async (req, res) => {
    try {
      const { userId } = req.body;
      const result = await this.projectService.listProjects(userId, res.locals.userId);
      console.log(result);
    } catch (error: any) {
      res.status(400).send({ error: error.message });
    }
  };
}
