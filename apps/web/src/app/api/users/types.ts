import { User } from "../../types/types";

export interface UsersApiResponse {
  users: User[];
  total: number;
}