import { jwtDecode } from "jwt-decode";
import { IUser } from "../models/User";
import { makeAutoObservable } from "mobx"
import { storageService } from "../services/storangeService";

class UserStore {
    user: IUser | undefined;

    constructor() {
        this.setUserData(storageService.getAccessToken() || '');
        makeAutoObservable(this)
    }
    get id(): string { return this.user?.id || '' };
    get name(): string { return this.user?.name || '' };
    get surname(): string { return this.user?.surname || '' };
    get birthdate(): string { return this.user?.birthdate || '' };
    get registerDate(): string { return this.user?.registerDate || '' };
    get email(): string { return this.user?.email || '' };
    get phoneNumber(): string { return this.user?.phoneNumber || '' };
    get roles(): string[] { return this.user?.roles || [] };
    get avatar(): string { return this.user?.avatar || '' };
    get isAdmin(): boolean { return this.user?.roles.includes('Admin') || false };
    get isAuthorized(): boolean { return this.user ? true : false };
    setUserData(token: string) {
        if (token) {
            const data: any = jwtDecode<IUser>(token);
            this.user = {
                id: data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
                name: data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
                surname: data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
                email: data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
                exp: data['exp'],
                iss: data['iss'],
                roles: data['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
                birthdate: data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/dateofbirth'],
                phoneNumber: data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/homephone'] || '',
                avatar: data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/anonymous'] || '',
                registerDate: data['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata'] || ''
            }
        }
    };
    clearUserData() { this.user = undefined }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default new UserStore();


