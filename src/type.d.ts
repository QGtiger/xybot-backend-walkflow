declare module 'express' {
  interface Request {
    user: {
      id: string;
    };
    headers: {
      authorization: `Bearer ${string}`;
      walkflow_userid: string;
    };
    ip: string;
    method: string;
    path: string;
    body: any;
  }
}
