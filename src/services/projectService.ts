import { ProjectModel } from "../models/projectModel";
import { UserModel } from "../models/userModel";

export class ProjectService {
  private projectModel: ProjectModel;

  constructor(projectModel: ProjectModel, userModel: UserModel) {
    this.projectModel = projectModel;
  }

  public async listProjects(userId: string) {
    return await this.projectModel.list(userId);
  }
}
