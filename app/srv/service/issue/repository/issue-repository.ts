import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
import {
  IIssueDataSource,
  IssueDataSourceFactory,
} from "../data-source/issue-data-source";
import { IssueAttachmentEntity } from "../entity/issue-attachment-entity";
import { IssueEntity, IssueStatus, IssueType } from "../entity/issue-entity";

export interface IIssueRepository {
  createIssue(
    documentDate: Date,
    warehouseId: number,
    issueType: IssueType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<IssueEntity>;
  createIssueAttachment(
    issueId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<IssueAttachmentEntity>;
  updateToInProgress(id: number): Promise<IssueEntity>;
  updateToComplete(id: number): Promise<IssueEntity>;
  findById(id: number): Promise<IssueEntity>;
  findAll(): Promise<IssueEntity[]>;
  countIssueAttachmentByType(issueId: number, type: ReceiveAttachmentType): Promise<number>;
}

export class IssueRepository implements IIssueRepository {
  constructor(private issueDataSource: IIssueDataSource) {}

  async createIssue(
    documentDate: Date,
    warehouseId: number,
    issueType: IssueType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<IssueEntity> {
    try {
      documentDate = new Date(documentDate);
      warehouseId = parseInt(warehouseId.toString());
      userIds = userIds?.map((userId) => parseInt(userId.toString()));
      productIds = productIds?.map((productId) =>
        parseInt(productId.toString())
      );
      return this.issueDataSource.createIssue(
        documentDate,
        warehouseId,
        issueType,
        userIds as number[],
        productIds as number[],
        description,
        referenceNumber
      );
    } catch (error) {
      throw error;
    }
  }

  async createIssueAttachment(
    issueId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<IssueAttachmentEntity> {
    try {
      issueId = parseInt(issueId.toString());
      return this.issueDataSource.createIssueAttachment(
        issueId,
        name,
        path,
        type
      );
    } catch (error) {
      throw error;
    }
  }

  async updateToInProgress(id: number): Promise<IssueEntity> {
    try {
      id = parseInt(id.toString());
      return this.issueDataSource.updateStatus(id, IssueStatus.IN_PROGRESS);
    } catch (error) {
      throw error;
    }
  }

  async updateToComplete(id: number): Promise<IssueEntity> {
    try {
      id = parseInt(id.toString());
      return this.issueDataSource.updateStatus(id, IssueStatus.COMPLETED);
    } catch (error) {
      throw error;
    }
  }

  async findById(id: number): Promise<IssueEntity> {
    try {
      id = parseInt(id.toString());
      return this.issueDataSource.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async findAll(): Promise<IssueEntity[]> {
    try {
      return this.issueDataSource.findAll();
    } catch (error) {
      throw error;
    }
  }

  async countIssueAttachmentByType(
    issueId: number,
    type: ReceiveAttachmentType
  ): Promise<number> {
    try {
      issueId = parseInt(issueId.toString());
      return this.issueDataSource.countIssueAttachmentByType(issueId, type);
    } catch (error) {
      throw error;
    }
  }
}

export class IssueRepositoryFactory {
  static create(): IIssueRepository {
    return new IssueRepository(IssueDataSourceFactory.create());
  }
}
