angular.module('starter.constants',[])
 
.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated',/*认证*/
  notAuthorized: 'auth-not-authorized'/*授权*/
})
 
.constant('USER_ROLES', {
  admin: 'admin_role',
  public: 'public_role'
});