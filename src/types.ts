export type ListParams = {
  page: number;
  size: number;
  mode: "pagination" | "all";
  search?: string;
  status: "active" | "inactive" | "all";
};
