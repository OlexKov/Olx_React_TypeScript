import React, { useState } from 'react'
import { AdvertTableProps } from '../../../models/Props'
import { Col, Divider, Empty, Pagination, Row, Select, Spin } from 'antd'
import AdvertCard from '../advert-cards/card'
import { useNavigate } from 'react-router-dom'
import { paginatorConfig } from '../../../helpers/constants'
import { TableOutlined, UnorderedListOutlined } from '@ant-design/icons'
import '../../search/Search.css'
import HorisontalAdvertCard from '../advert-cards/horizontal-card'

const AdvertTable: React.FC<AdvertTableProps> = ({onEdit, loading, adverts = [], page, title, total = 0, sortIndex, pageSize, onChange = () => { }, onAdvertChange = () => { } }) => {
    const navigate = useNavigate();
    const [tableStyle, setTableStyle] = useState<boolean>(false)

    const onPaginationChange = (page: number, pageSize: number) => {
        onChange(page, pageSize, sortIndex)
        window.scrollTo(0, 0)
    }

    const onSortChange = (index: number) => {
        if(index !== sortIndex ){
            page = paginatorConfig.pagination.defaultCurrent;
        }
        onChange(page, pageSize, index)
    }

    const getTitle = (): string => {
        var title = "Ми знайшли "
        if (total < 1000) {
            title += total;
        } else {
            title += 'більше 1000'
        }
        if (total < 5 && total !== 0) {
            title += ' оголошення'
        } else {
            title += ' оголошень'
        }
        return title;
    }

    return (
        <div className='d-flex h-100 flex-column gap-2 w-70 mx-auto'>
            <Divider orientation='left' style={{ borderColor: 'gray', fontSize: 18 }}>{title}</Divider>
            {adverts.length > 0
                ?
                <>
                    <div className='px-5 d-flex gap-4 justify-content-end fs-3 text-body-secondary align-items-center'>
                        <span style={{ fontSize: 16 }}>Сортувати за:</span>
                        <div className='filter-element-container'>
                            <Select
                                allowClear
                                style={{ minWidth: 200 }}
                                className='filter-element'
                                placeholder='Не сортоване'
                                size='large'
                                options={[
                                    { value: 1, label: ' Найновіші ' },
                                    { value: 2, label: ' Найдорожчі ' },
                                    { value: 3, label: ' Найдешевші ' }
                                ]}
                                value={sortIndex}
                                onChange={onSortChange}
                                disabled={adverts.length < 2} />
                        </div>
                        <UnorderedListOutlined
                            style={{ color: tableStyle ? 'gray' : 'black' }}
                            onClick={() => setTableStyle(false)} />
                        <TableOutlined
                            style={{ color: tableStyle ? 'black' : 'gray' }}
                            onClick={() => setTableStyle(true)} />
                    </div>
                    <h3>{getTitle()}</h3>
                    {tableStyle
                        ? <Row gutter={[10, 10]}>
                            {adverts.map((x) =>
                                <Col
                                    sm={{ span: 24 }}
                                    md={{ span: 24 }}
                                    lg={{ span: 12 }}
                                    xl={{ span: 8 }}
                                    xxl={{ span: 6 }}
                                    key={x.id}>
                                    <AdvertCard
                                        key={x.id}
                                        onFavoriteChange={onAdvertChange}
                                        advert={x}
                                        onClick={(id: number) => navigate(`/advert?id=${id}`)} 
                                        onEdit={onEdit}/>
                                </Col>)}
                        </Row>
                        
                        : <div className='d-flex flex-column gap-2'>
                            {adverts.map(x =>
                                <HorisontalAdvertCard
                                    key={x.id}
                                    onFavoriteChange={onAdvertChange}
                                    advert={x}
                                    onClick={(id: number) => navigate(`/advert?id=${id}`)} 
                                    onEdit={onEdit}/>)}
                        </div>}

                    <Pagination
                        align="center"
                        showSizeChanger
                        showQuickJumper
                        pageSizeOptions={paginatorConfig.pagination.pageSizeOptions}
                        locale={paginatorConfig.pagination.locale}
                        showTotal={paginatorConfig.pagination.showTotal}
                        current={page || paginatorConfig.pagination.defaultCurrent}
                        total={total}
                        pageSize={pageSize || paginatorConfig.pagination.defaultPageSize}
                        onChange={onPaginationChange}
                        className='mt-4' />
                </> : <>{loading && adverts.length === 0
                    ? <Spin className='d-block mx-auto my-5' size='large' />
                    : (loading !== undefined && <Empty className=' bg-body-secondary' description={<span>Оголошення відсутні</span>} />)}</>}
        </div>
    )
}

export default AdvertTable