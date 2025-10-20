import { responseCode } from "./code";

interface APIResponse<T = undefined> {
  code: responseCode;
  message: string;
  completed_at?: string;
  data?: T;
}


export default APIResponse