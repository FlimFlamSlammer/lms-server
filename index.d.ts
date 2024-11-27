declare namespace Express {
  export interface Request {
    account: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }
}
