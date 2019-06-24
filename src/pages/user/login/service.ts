import request from '@/utils/request';
import { FromDataType } from './index';

export async function AccountLogin(params: FromDataType) {
  return request('/users/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/login/captcha?mobile=${mobile}`);
}
