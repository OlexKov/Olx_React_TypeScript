import React, { useEffect, useState } from 'react'
import { AdvertFitersProps } from '../../models/Props'
import { AdvertFilterModel } from '../../models/AdvertFilterModel'
import { filterService } from '../../services/filterService'
import { Col, Select } from 'antd'
import { FilterData } from '../../models/Models'
import '../search/Search.css'
import DisabledRow from '../common-components/DisabledRow'

const Filters: React.FC<AdvertFitersProps> = ({ child, categoryId, values, grayBg, onChange = () => { } }) => {
    const [categoryFilters, setCategoryFilters] = useState<AdvertFilterModel[]>([])

    useEffect(() => {
        (async () => {
            if (categoryId) {
                var result = await filterService.getCategoryFilters(categoryId)
                if (result.status === 200) {
                    setCategoryFilters(result.data)
                }
            }
        })()
    }, [categoryId])

    const onFilterChange = (data: FilterData) => {
        var tempValues = [...values || []];
        const element = tempValues.find(x => x.filterId === data.filterId)
        let index = undefined;
        if (element) {
            index = tempValues.indexOf(element)
            if (index >= 0) {
                tempValues.splice(index, 1);
            }
        }
        if (data.id) {
            tempValues.push(data)
        }
        onChange(tempValues)
    }

    return (

        <DisabledRow enabled={!child}>
            {categoryFilters.map((catFilter, index) =>
                <Col
                    sm={{ span: 24 }}
                    md={{ span: 24 }}
                    lg={{ span: 12 }}
                    xl={{ span: 8 }}
                    xxl={{ span: 6 }}
                    key={index}>
                    <div className='filter-item-container'>
                        <span>{catFilter.name}</span>
                        <div className='filter-element-container'>
                            <Select
                                allowClear
                                value={values?.find(x => x.filterId === catFilter.id)?.id}
                                placeholder="Всі оголошення"
                                className={`w-100 no-border ${ grayBg ? '' : ' no-border-container'} `}
                                size='large'
                                options={catFilter.values?.map(x => ({ value: x.id, label: x.value }))}
                                onChange={(valueId) => onFilterChange({ filterId: catFilter.id, id: valueId })} />

                        </div>
                    </div>
                </Col>
            )}
        </DisabledRow>
    )
}

export default Filters