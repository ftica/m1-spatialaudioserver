import { ROLE_USER, verifyPassword } from '../../configs/auth/auth-utils';
import AuthUser from '../../database/models/auth-user';

const createToken = async (db, user) => db.AccessToken.create({
  expires: new Date(Date.now() + (60 * 60)),
  authUser: user.id
}, { include: AuthUser });

const login = async (db, email, password) => {
  const authUser = await db.AuthUser.findOne({ where: { email } });

  if (!await verifyPassword(password, authUser.password)) {
    return null;
  }

  // eslint-disable-next-line no-return-await
  return await createToken(db, authUser);
};

const register = async (db, {
  email,
  password
}) => await new AuthUser({
  email,
  password,
  roles: [ROLE_USER]
}).save();

const changeRole = async (db, id, newRole) => {

};

export {
  login,
  register
};
