import '../favorite-adverts/FavAdvert.css'
import AdvertTable from '../../advert/advert-table'
import { TableData } from '../../../models/Models'
import { AdvertModel } from '../../../models/AdvertModel'
import user from '../../../stores/UserStore'
import { advertService } from '../../../services/advertService'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const UserAdverts :React.FC= () => {
  const [advertTableData, setAdvertTableData] = useState<TableData>(({
    page: 1,
    count: 5,
    sortIndex: undefined
  }));
  const [total, setTotal] = useState<number>(0)
  const [adverts, setAdverts] = useState<AdvertModel[]>([])
  const navigate = useNavigate();

  useEffect(() => {
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [advertTableData])
  
  const loadData = async () => {
      const formData = new FormData();
      for (const key in advertTableData) {
        formData.append(key, advertTableData[key as keyof TableData]?.toString() || '0');
      }
      formData.append('userId', user.id);
      const result = await advertService.getUserAdverts(formData);
      if (result.status === 200) {
        setAdverts(result.data.elements)
        setTotal(result.data.totalCount)
      }
  }

  const onChange = (page: number, pageSize: number, sortIndex: number) => {
    setAdvertTableData(prev => ({ ...prev, page: page, count: pageSize, sortIndex: sortIndex }))
  }
  return (
    <>
    <div className=' bg-white'>
        <div className='mx-auto w-70 pb-5 h-25'>
          <h2 style={{ fontSize: 35, fontWeight: 'bold' }} className='p-5'>Ваші оголошення</h2>
        </div>
      </div>

      <div className='h-100  py-4'>
        <AdvertTable
          title='Ваші оголошення'
          page={advertTableData?.page}
          pageSize={advertTableData?.count}
          total={total}
          adverts={adverts}
          onChange={onChange}
          sortIndex={advertTableData.sortIndex} 
          onEdit={(id:number)=>navigate(`/create-advert?id=${id}`)}/>
      </div>
    </>
  )
}

export default UserAdverts