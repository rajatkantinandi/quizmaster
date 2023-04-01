import Cookies from 'js-cookie';

export const isValidUser = !!Cookies.get('userToken') || Cookies.get('userName') === 'guest';
