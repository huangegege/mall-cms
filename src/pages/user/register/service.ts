import request from '../../../utils/request';
import { IUserRegisterParams } from './index';

export async function register(params: IUserRegisterParams) {
  return request('/api/users', {
    method: 'POST',
    data: params,
  });
}
