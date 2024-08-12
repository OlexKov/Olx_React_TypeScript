import React, { useEffect, useState } from 'react'
import '../favorite-adverts/FavAdvert.css'
import AdvertTable from '../../advert/advert-table'
import { LocalFavoriteModel, TableData } from '../../../models/Models'
import { AdvertModel } from '../../../models/AdvertModel'
import user from '../../../stores/UserStore'
import { storageService } from '../../../services/storangeService'
import { advertService } from '../../../services/advertService'

const FavoriteAdverts: React.FC = () => {
  const [advertTableData, setAdvertTableData] = useState<TableData>(({
    page: 1,
    count: 5,
    sortIndex: undefined
  }));
  const [total, setTotal] = useState<number>(0)
  const [adverts, setAdverts] = useState<AdvertModel[]>([])

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advertTableData])
  
  const loadData = async () => {
    if (user.isAuthorized) {
      const formData = new FormData();
      
      for (const key in advertTableData) {
        formData.append(key, advertTableData[key as keyof TableData]?.toString() || '0');
      }
      formData.append('userId', user.id);
      const result = await advertService.getFavByFilter(formData);
      if (result.status === 200) {
        setAdverts(result.data.elements)
        setTotal(result.data.totalCount)
      }
    } else {
      setTotal(storageService.getLocalFavorites().length)
      const tempFavs = sort(storageService.getLocalFavorites(), advertTableData.sortIndex) || [];
      if (tempFavs?.length > 0) {
        const start = (advertTableData.page - 1) * advertTableData.count;
        const end = start + advertTableData.count
        const result = await advertService.getByIDs(tempFavs.map(x => x.id).slice(start, end));
        if (result.status === 200 && result.data.length > 0) {
          setAdverts(sort(result.data, advertTableData.sortIndex) as AdvertModel[])
        }
      }
    }
  }

  const sort = (adverts: AdvertModel[] | LocalFavoriteModel[], sortIndex: number | undefined): AdvertModel[] | LocalFavoriteModel[] | undefined => {
    switch (sortIndex) {
      case 1:
        return adverts.sort((a: AdvertModel | LocalFavoriteModel, b: AdvertModel | LocalFavoriteModel) => {
          if (a.date < b.date)
            return -1;
          if (a.date > b.date)
            return 1;
          return 0;
        })
      case 2:
        return adverts.sort((a: AdvertModel | LocalFavoriteModel, b: AdvertModel | LocalFavoriteModel) => b.price - a.price)
      case 3:
        return adverts.sort((a: AdvertModel | LocalFavoriteModel, b: AdvertModel | LocalFavoriteModel) => a.price - b.price)
      default:
        return adverts
    }
  }

  const onChange = (page: number, pageSize: number, sortIndex: number) => {
    setAdvertTableData(prev => ({ ...prev, page: page, count: pageSize, sortIndex: sortIndex }))
  }

  const onFavoriteChange = (id:number) => {
    setAdverts(adverts.filter(x=>x.id !== id))
    loadData()
  }

  return (
    <>
      <div className=' bg-white'>
        <div className='mx-auto w-70 pb-5 h-25'>
          <h2 style={{ fontSize: 35, fontWeight: 'bold' }} className='p-5'>Обрані оголошення</h2>
        </div>
      </div>

      <div className='h-100  py-4'>
        <AdvertTable
          title='Вибрані оголошення'
          page={advertTableData?.page}
          pageSize={advertTableData?.count}
          total={total}
          adverts={adverts}
          onChange={onChange}
          onAdvertChange={onFavoriteChange}
          sortIndex={advertTableData.sortIndex} />
      </div>

    </>


  )
}

export default FavoriteAdverts