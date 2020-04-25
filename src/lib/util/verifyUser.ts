import User from '../models/User';
import jwt from 'jsonwebtoken';
import verifyParamNotNull from './verifyParamNotNull';
import throwError from '../throwError';

export default async function verifyUser(headers: any, id: string = '') {
  const token = headers['x-access-token'];
  verifyParamNotNull([token]);
  const userValue = await verifyToken(token, id);
  return userValue;
}

export async function verifyToken(token: string, id: string) {
  try {
    let tokenValue: any = null;
    try {
      tokenValue = jwt.verify(token, process.env.TOKEN_KEY || 'tokenkey');
    } catch (error) {
      return throwError('토큰 검증에 실패했습니다.', 403);
    }

    // tslint:disable-next-line: await-promise
    const user = await User.findOne({ id: tokenValue.userId });
    if (!user) {
      return throwError('로그인에 실패했습니다.', 401);
    }
    if (user.id !== id && id) {
      return throwError('토큰 검증에 실패했습니다.', 403);
    }
    return user;
  } catch (error) {
    return throwError('토큰 검증에 실패했습니다.', 403);
  }
}
