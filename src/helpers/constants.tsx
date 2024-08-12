export const imagesUrl = (process.env.REACT_APP_SERVER_HOST || '') + process.env.REACT_APP_IMAGES_FOLDER;

export const formPostConfig = {
    headers: {
        'Content-type': 'multipart/form-data'
    },
};
export const postBodyConfig = {
    headers: {
        'Content-type': 'application/json'
    }
}

export const emptyFilter = {
    cityId: undefined,
    areaId: undefined,
    search: undefined,
    categoryId: undefined,
    isNew: undefined,
    isVip: undefined,
    isContractPrice: undefined,
    priceFrom: undefined,
    priceTo: undefined,
    filterValues: [],
    page: undefined,
    count: undefined,
}

export const paginatorConfig = {
    pagination: {
        defaultPageSize: 5,
        defaultCurrent: 1,
        pageSizeOptions: [5, 10, 15, 20],
        showSizeChanger: true,
        locale: { items_per_page: " / на cторінці" },
        showTotal: (total:number, range:number[]) =>
            <div className="d-flex gap-2">
                <span className=" fw-bold"> { range[0]} </span>
                    < span > -</span>
                    < span className=" fw-bold" > { range[1]} </span>
                    < span > із </span>
                    < span className=" fw-bold" > { total } </span>
                    </div>
    },
}

