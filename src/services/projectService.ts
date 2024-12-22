import { ProjectModel } from "../models/projectModel";
import { UserModel } from "../models/userModel";
import { AppError, ERRORS } from "../utils/errors";

export class ProjectService {
  private projectModel: ProjectModel;
  private userModel: UserModel;

  constructor(projectModel: ProjectModel, userModel: UserModel) {
    this.projectModel = projectModel;
    this.userModel = userModel;
  }

  public async listProjects(userId: string, userSessionId: string) {
    if (!userId) {
      throw new AppError(ERRORS.USER_ID_NOT_SENT);
    }

    const userExists = await this.userModel.getUserById(userId);

    if (!userExists) {
      throw new AppError(ERRORS.USER_NOT_FOUND);
    }

    if (userExists.id !== userSessionId) {
      throw new AppError(ERRORS.ACCESS_NOT_ALLOWED);
    }

    return await this.projectModel.listAllProjects(userId);
  }
}
