export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type RegisterInput = Omit<User, 'id'>;

export type LoginInput = Pick<User, 'email' | 'password'>;
