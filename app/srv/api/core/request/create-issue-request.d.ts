import { IssueType } from "../../service/issue/entity/issue-entity";

export type CreateIssueRequest = {
  documentDate: Date;
  warehouseId: number;
  issueType: IssueType;
  userIds: number[];
  productIds: number[];
};
