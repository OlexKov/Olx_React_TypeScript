import { Navigate } from "react-router-dom";
import user from '../../stores/UserStore'
import { observer } from "mobx-react";
import { ProtectedRouteProps } from "../../models/Props";
 const UserProtectedRoute: React.FC<ProtectedRouteProps> = observer(({redirectPath = '/login', children}) => {
   if(user.isAuthorized){
      if(user.isAdmin){
        redirectPath = '/forbiden'
      }
      else{
        return children;
      } 
    }
    return <Navigate to={redirectPath} replace />
  });
  export default UserProtectedRoute;