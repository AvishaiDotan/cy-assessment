import { IUser } from "@avishaidotan/shared-lib";

export type UserWithoutPassword = Omit<IUser, 'password'>;