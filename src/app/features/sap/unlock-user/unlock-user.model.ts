export interface UserActionResult {
  internalKey: number;
  userCode: string;
  status: 'locked' | 'unlocked';
  sapResult?: any;
}

export interface UserActionResponse {
  message: string;
  data: UserActionResult;
}
