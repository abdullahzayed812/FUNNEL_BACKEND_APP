import { ProjectModel } from "../models/projectModel";
import { UserModel } from "../models/userModel";
import { AppError, ERRORS } from "../configs/error";

export class ProjectService {
  private projectModel: ProjectModel;
  private userModel: UserModel;

  constructor(projectModel: ProjectModel, userModel: UserModel) {
    this.projectModel = projectModel;
    this.userModel = userModel;
  }

  public async listProjects(userId: string) {
    if (!userId) {
      throw new AppError(ERRORS.USER_ID_NOT_SENT);
    }

    const userExists = await this.userModel.getUserById(userId);

    if (!userExists) {
      throw new AppError(ERRORS.USER_NOT_FOUND);
    }

    return await this.projectModel.listProjects(userId);
  }

  public async getProjectData(projectId: string, userId: string) {
    if (!projectId) {
      throw new AppError(ERRORS.PROJECT_ID_NOT_SENT);
    }

    const projectExists = await this.projectModel.getProjectById(projectId);

    if (!projectExists) {
      throw new AppError(ERRORS.PROJECT_NOT_FOUND);
    }

    return await this.projectModel.getProjectData(projectId, userId);
  }
}
