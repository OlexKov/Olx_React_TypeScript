import { ReactElement } from "react"
import { AdvertModel } from "./AdvertModel"
import { CategoryModel } from "./CategoryModel"
import { AdvertSearchModel } from "./FilterModel"
import { UploadFile } from "antd"
import { FilterData } from "./Models"


export interface ImageLoaderProps {
    files: UploadFile[]
    onChange?: Function
}

export interface SearchProps {
    filter?: AdvertSearchModel
    isFilter?: boolean
    onSearch?: Function
    categories?: CategoryModel[]
}

export interface CategoryViewProps {
    category?: CategoryModel
    onClick?: Function
}

export interface AdvertViewProps {
    advert: AdvertModel
    onClick?: Function
    onFavoriteChange?: Function
    onEdit?:Function
}

export interface StartContentProps {
    categories: CategoryModel[]
    onCategorySelect?: Function
}

export interface FilterProps {
    filter?: AdvertSearchModel
    categories?: CategoryModel[]
    adverts?: AdvertModel[]
    onFilterChange?: Function
}

export interface ProtectedRouteProps {
    redirectPath?: string
    children: ReactElement
}

export interface AdvertFitersProps {
    categoryId?: number
    values?: FilterData[]
    onChange?: Function
    grayBg?: boolean
    child?: boolean
}

export interface DisabledRowProps {
    enabled?: boolean
    children?: ReactElement[]
}

export interface CategoryGridProps {
    categories: CategoryModel[]
    handleClick?: Function
}

export interface SortedImageProps {
    item: UploadFile,
    deleteHandler: Function
}

export interface ErrorProps {
    status?: string;
    title?: string;
    subTitle?: string;
}

export interface AdvertTableProps{
    title?:string
    loading?:boolean
    adverts?:AdvertModel[]
    page?:number
    pageSize?:number
    total?:number
    onChange?:Function
    onAdvertChange?:Function
    sortIndex?:number
    onEdit?:Function
}

export interface FavoriteButtonProps{
    advert?:AdvertModel,
    onChange?:Function
}

export interface CategorySelectorProps {
    categoryId?: number
    onChange?: Function
}