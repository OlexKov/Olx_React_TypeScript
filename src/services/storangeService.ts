import { LocalFavoriteModel } from "../models/Models";

const accessKey = process.env.REACT_APP_ACCESS_KEY || '';
const favouritesKey = process.env.REACT_APP_FAVORITES_KEY || '';
const isSessionStorage = () => sessionStorage.getItem(accessKey) !== null;

export const storageService = {
    saveTokens: (accessToken: string) => {
        if (isSessionStorage()) {
            sessionStorage.setItem(accessKey, accessToken);
            localStorage.removeItem(accessKey);
        }
        else {
            localStorage.setItem(accessKey, accessToken);
            sessionStorage.removeItem(accessKey);
        }
    },

    getAccessToken: () => sessionStorage.getItem(accessKey) || localStorage.getItem(accessKey),

    setTemporalyTokens: (accessToken: string) => sessionStorage.setItem(accessKey, accessToken),

    removeTokens: () => {
        localStorage.removeItem(accessKey);
        sessionStorage.removeItem(accessKey);
    },

    isLocalFavorites: (): boolean => localStorage.getItem(favouritesKey) ? true : false,

    getLocalFavorites: (): LocalFavoriteModel[] => {
        const fav = localStorage.getItem(favouritesKey);
        return fav ? JSON.parse(fav) : []
    },

    setLocalFavorites: (favorites: LocalFavoriteModel[]) => localStorage.setItem(favouritesKey, JSON.stringify(favorites)),

    toggleFavorites: ( favorite:  LocalFavoriteModel) => {
        let favs: LocalFavoriteModel[] = [];
        if (storageService.isLocalFavorites()) {
            favs = storageService.getLocalFavorites();
            if(favs.find(x=>x.id ===  favorite.id)){
                storageService.setLocalFavorites(favs.filter(x => x.id !==  favorite.id));
                return
            }
        }
        favs.push( favorite)
        storageService.setLocalFavorites(favs);
        //localStorage.removeItem(favouritesKey)
    },

    // removeFromLocalFavorites: (id: number) => {
    //     if (storageService.isLocalFavorites()) {
    //         const ids: number[] = storageService.getLocalFavorites();
            
    //         console.log(ids.filter(x => x !== id))
    //     }
    // }
}