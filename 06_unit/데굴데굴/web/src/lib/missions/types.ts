export type MissionSubmission = {
  team: string;
  member: string;
  displayName: string;
  role?: string;
  week: number;
  submitted: boolean;
  filePath: string;
};

export type TeamProgress = {
  team: string;
  submittedCount: number;
  totalCount: number;
  members: MissionSubmission[];
};
