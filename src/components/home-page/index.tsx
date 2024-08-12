
import React, { useEffect, useState } from 'react'
import { CategoryModel } from '../../models/CategoryModel';
import { categoryService } from '../../services/categoryService';
import { AdvertModel } from '../../models/AdvertModel';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getQueryString, setQueryParams } from '../../helpers/common-methods';
import { AdvertSearchModel } from '../../models/FilterModel';
import StartContent from './start-content';
import Search from '../search';
import { FilterData } from '../../models/Models';
import { advertService } from '../../services/advertService';
import { Spin } from 'antd';
import { emptyFilter, paginatorConfig } from '../../helpers/constants';
import AdvertTable from '../advert/advert-table';

const HomePage: React.FC = () => {
  const setFilterFromQuery = () => {
    if (location.pathname === '/') {
      return emptyFilter;
    }
    else {
      return {
        cityId: Number(searchParams.get("cityId")) || undefined,
        areaId: Number(searchParams.get("areaId")) || undefined,
        search: searchParams.get("search") || undefined,
        categoryId: Number(searchParams.get("categoryId")) || undefined,
        isNew: searchParams.get("isNew") ? searchParams.get("isNew") === "true" : undefined,
        isVip: searchParams.get("isVip") ? searchParams.get("isVip") === "true" : undefined,
        isContractPrice: searchParams.get("isContractPrice") ? searchParams.get("isContractPrice") === "true" : undefined,
        priceFrom: Number(searchParams.get("priceFrom")) || undefined,
        priceTo: Number(searchParams.get("priceTo")) || undefined,
        filterValues: searchParams.get("filterValues")
          ? (JSON.parse(searchParams.get("filterValues") || '') as FilterData[])
          : [],
        page: Number(searchParams.get("page")) || paginatorConfig.pagination.defaultCurrent,
        count: Number(searchParams.get("count")) || paginatorConfig.pagination.defaultPageSize,
        sortIndex: Number(searchParams.get("sortIndex")) || undefined,
      }
    }
  }
  const [categories, setCategories] = useState<CategoryModel[]>();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams('');
  const [adverts, setAdverts] = useState<AdvertModel[]>([]);
  const [total, setTotal] = useState<number>();
  const [filter, setFilter] = useState<AdvertSearchModel>(setFilterFromQuery())
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    if (location.pathname !== '/') {
      (async () => {
        setLoading(true)
        const formData = new FormData();
        if (!filter.sortIndex) {
          filter.sortIndex = 0;
        }
        for (const key in filter) {
          if (key === 'filterValues') {
            (filter[key as keyof AdvertSearchModel] as FilterData[])?.forEach((item) => {
              formData.append(key, item.id?.toString());
            });
          }
          else {
            formData.append(key, filter[key as keyof AdvertSearchModel]?.toString() || '');
          }
        }
        const result = await advertService.getByFilter(formData);
        if (result.status === 200) {
          setAdverts(result.data.elements)
          setTotal(result.data.totalCount)
        }
        setLoading(false)
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  useEffect(() => {
    (async () => {
      const categs = await categoryService.getAll()
      if (categs?.status === 200)
        setCategories(categs.data)
    })()

  }, [])

  useEffect(() => {
    if (location.pathname === '/') {
      setFilter(emptyFilter)
    }
    else {
       setFilter(setFilterFromQuery())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  const onSearch = (searchFilter: AdvertSearchModel) => {
    if (location.pathname === '/') {
      navigate(`/main-search${getQueryString(searchFilter)}`);
    }
    else {
         setSearchParams(getQueryString(searchFilter))
    }
  }

  const categorySelect = (id: number) => {
    if (location.pathname === '/') {
      navigate(`/main-search?categoryId=${id}&count=${paginatorConfig.pagination.defaultPageSize}&page=${paginatorConfig.pagination.defaultCurrent}`);
    }
  }

  const onPaginationChange = (current: number, pageSize: number, sortIndex: number) => {
    setQueryParams(searchParams, { sortIndex: sortIndex, count: pageSize, page: current })
    setSearchParams(searchParams)
  };

  return (
    <div className='my-5'>
      <Search categories={categories} isFilter={location.pathname !== '/'} filter={filter} onSearch={onSearch} />
      {location.pathname === '/'
        ? <>
          <Spin fullscreen size='large' spinning={!categories} />
          {categories && <StartContent
            categories={categories}
            onCategorySelect={categorySelect} />}
        </>
        : <AdvertTable
          loading={loading}
          adverts={adverts}
          total={total}
          page={filter.page}
          pageSize={filter.count}
          onChange={onPaginationChange}
          title='Знайдені оголошення' />
      }
    </div>
  )
}

export default HomePage

