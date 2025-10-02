type UserApiRole = "usuario" | "administrador";

type UserApiResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserApiRole;
  }
}