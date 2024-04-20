interface User {
  id: number;
  username: string;
  avatar: string;
}

interface UserDetail extends User {
  email: string;
  is_superuser: boolean;
  verified: boolean;
}
