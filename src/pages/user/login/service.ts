import request from '@/utils/request';
import { FromDataType } from './index';

export async function AccountLogin(params: FromDataType) {
  return request('/api/users/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
