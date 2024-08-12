import { GetProp, UploadFile, UploadProps } from "antd";
import { DefaultOptionType } from "antd/es/cascader";
import { AxiosResponse } from "axios";

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const reorder = (list: UploadFile[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export const getQueryString = (filter: any): string => {
  var result = '';
  Object.keys(filter).forEach((key) => {
    if (filter[key] !== undefined
      && filter[key] !== null
      && filter[key] !== ''
      && filter[key]?.length !== 0) {
      var value = typeof (filter[key]) === "object"
        ? JSON.stringify(filter[key])
        : filter[key];
      var symbol = result === '' ? '?' : '&'
      result += `${symbol + key}=${value}`
    }
  });
  return result;
} 

export const setQueryParams = (searchParams: URLSearchParams,params:any)=>{
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined
      && params[key] !== null
      && params[key] !== ''
      && params[key]?.length !== 0) {
        searchParams.set(key,params[key])
    }
    else{
      searchParams.delete(key)
    }
  });

}

export const filterTree: boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean) | undefined = (search:string, item:DefaultOptionType):boolean => {
  var res = false;
  if (item.title) {
      res = item.title?.toLowerCase()?.indexOf(search.toLowerCase()) >= 0;
  }
  return res;
} 

export const  TryError = <T>(funct:Function):AxiosResponse<T,any>=>{
  return funct().catch((error:any)=>error)
}