/**
   * Original code
  ```js
    import Cookies from 'js-cookie';
    export const isValidUser = !!Cookies.get('userToken') || Cookies.get('userName') === 'guest';
  ```
   */
// Temporarily enable guest user logged in by default
// TODO: revert this when we have a backend & login functionality
export const isValidUser = true; // !!Cookies.get('userToken') || Cookies.get('userName') === 'guest';
