import { Navigate } from "react-router-dom";
import user from '../../stores/UserStore'
import { observer } from "mobx-react";
import { ProtectedRouteProps } from "../../models/Props";
 const AuthProtectedRoute: React.FC<ProtectedRouteProps> = observer(({redirectPath = '/login', children}) => {
   if(!user.isAuthorized){
      return <Navigate to={redirectPath} replace />
   }
   return children;
  });
  export default AuthProtectedRoute;