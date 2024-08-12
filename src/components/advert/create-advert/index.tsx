import React, { useEffect, useState } from 'react';
import { Button, Form, Input, InputNumber, message, Radio, Spin, Switch, TreeSelect, TreeSelectProps, type UploadFile } from 'antd';
import ImageUpload from '../../common-components/ImageUpload';
import { AdvertCreationModel } from '../../../models/AdvertCreationModel';
import CategorySelector from '../../category/category-selector';
import './CreateAdvert.css'
import TextArea from 'antd/es/input/TextArea';
import { areaService } from '../../../services/areaService';
import { SmileOutlined } from '@ant-design/icons';
import { cityService } from '../../../services/cityService';
import { CityModel } from '../../../models/CityModel';
import { advertService } from '../../../services/advertService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import user from '../../../stores/UserStore'
import { FilterData, TreeElement } from '../../../models/Models';
import Filters from '../../filters';
import { filterTree } from '../../../helpers/common-methods';
import '../../search/Search.css'
import { AdvertModel } from '../../../models/AdvertModel';
import Error from '../../Error'
import { filterService } from '../../../services/filterService';
import { imagesUrl } from '../../../helpers/constants';
import { ImageModel } from '../../../models/ImageModel';

const CreateAdvert: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = Number(searchParams.get("id"))
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [priceFree, setPriceFree] = useState<boolean>(false);
  const [treeElements, setTreeElements] = useState<TreeElement[]>([]);
  const [publishing, setPublishing] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<FilterData[]>([]);
  const [editAdvert, setEditAdvert] = useState<AdvertModel>();
  const [error, setError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [form] = Form.useForm();

  useEffect(() => {
    (async () => {
      const areas = await areaService.getAll();
      if (areas.status === 200) {
        var elements = areas.data.map(x => ({ id: -x.id, value: -x.id, title: x.name, pId: 0, selectable: false, key: -x.id }))
        setTreeElements(elements);
      }
      if (!isNaN(id) && id !== 0) {
        const [images, filters, advert] = await Promise.all([
          advertService.getImages(id),
          filterService.getAdvertFilterValues(id),
          advertService.getById(id),
        ]);

        if (advert.status === 200) {
          setEditAdvert(advert.data)
          setSelectedCategoryId(advert.data.categoryId)
          setPriceFree(advert.data.price === 0)
          if (filters.status === 200) {
            setFilterValues(filters.data.map(x => ({ id: x.id, filterId: x.filterId }) as FilterData))
          }

          if (images.status === 200) {
            setFiles(images.data
              .sort((a: ImageModel, b: ImageModel) => { return a.priority - b.priority })
              .map(x => ({ url: imagesUrl + "/1200_" + x.name, originFileObj: new File([new Blob([''])], x.name, { type: 'old-image' }) }) as UploadFile))
          }

          const areaCities = await cityService.getByAreaId(advert.data.areaId)
          if (areaCities.status === 200) {
            var cities = areaCities.data.map(x => ({ id: x.id, value: x.id, title: x.name, selectable: true, pId: advert.data.areaId, key: x.id }))
            setTreeElements([...treeElements, ...cities]);
          }
        } else{
          setError(true)
        }
         
      } else if(id !== 0){
        setError(true)
      }
      setLoading(false)

    })()
  }, []);

  useEffect(() => {
    if (id === 0 && editAdvert) {
      window.location.reload();
    }
  }, [id])


  const onFinish = async (advert: AdvertCreationModel) => {
    setPublishing(true);
    advert.id = !isNaN(id) ? id : 0
    advert.userId = user.id;
    var formData = new FormData();
    Object.keys(advert).forEach(function (key) {
      if (key === 'imageFiles') {
        advert[key]?.forEach((x) => formData.append(key, x?.originFileObj as Blob))
      } else if (key === 'filterValues') {
        advert[key]?.forEach((x) => formData.append(key, x.id?.toString() || ''))
      }
      else {
        var value = advert[key as keyof AdvertCreationModel];
        if (value) {
          if (typeof (value) !== 'string')
            formData.append(key, value.toString());
          else
            formData.append(key, value);
        }
      }
    });
    if (advert.id === 0) {
      var create = await advertService.create(formData)
      if (create.status === 200) {
        message.success('Оголошення успішно опубліковано');
      }
    } else {
      var update = await advertService.update(formData)
      if (update.status === 200) {
        message.success('Оголошення успішно оновлено');
      }
    }
    navigate(-1)
    setPublishing(false);
  }

  const getTreeNode = async (parentId: number) => {
    var result = await cityService.getByAreaId(-parentId);
    if (result.status === 200) {
      return (result.data as CityModel[]).map(x => ({ id: x.id, value: x.id, title: x.name, pId: parentId, isLeaf: true, key: x.id }));
    }
    else return []
  };


  const onLoadData: TreeSelectProps['loadData'] = async ({ id }) => {
    var temp = [...treeElements, ...(await getTreeNode(id))];
    setTreeElements(temp as TreeElement[]);
  }

  return (
    <>
      <Spin spinning={loading} size='large' fullscreen />
      {!error && !loading &&
        <div className=' w-70 mx-auto d-flex flex-column align-items-start'>
          <h2 className='mt-4 fw-bold'>Створити оголошення</h2>
          <Form
            form={form}
            layout='vertical'
            initialValues={{
              phoneNumber: editAdvert ? editAdvert.phoneNumber : user.phoneNumber,
              contactEmail: editAdvert ? editAdvert.contactEmail : user.email,
              contactPersone: editAdvert ? editAdvert.contactPersone : user.name + ' ' + user.surname,
              title: editAdvert ? editAdvert.title : '',
              categoryId: editAdvert ? editAdvert.categoryId : undefined,
              description: editAdvert ? editAdvert.description : undefined,
              isNew: editAdvert ? editAdvert.isNew : true,
              isVip: editAdvert ? editAdvert.isVip : true,
              isContractPrice: editAdvert ? editAdvert.isContractPrice : false,
              price: editAdvert ? editAdvert.price : undefined,
              cityId: editAdvert ? editAdvert.cityId : undefined,
              imageFiles: files
            }}
            onFinish={onFinish}
            className='w-100 my-4' >
            <div className='white-container'>
              <h4>Опишіть у подробицях</h4>
              <Form.Item
                name="title"
                label={<h6>Вкажіть назву</h6>}
                hasFeedback
                className='fs-3'
                rules={[
                  {
                    pattern: RegExp('^[A-Z А-Я].*'),
                    message: "Заголовок повинен починатися з великої букви"
                  },
                  {
                    required: true,
                    message: "Не забудьте заповнити заголовок"
                  },
                  {
                    min: 16,
                    message: "Введіть щонайменше 16 символів"
                  },
                ]}
              >
                <Input size='large' className='p-2 no-border no-border-container' placeholder="Наприклад,iPhone 11 з гарантією" showCount minLength={16} maxLength={500} />
              </Form.Item>
              <Form.Item
                hasFeedback
                name="categoryId"
                valuePropName='categoryId'
                label={<h6>Категорія</h6>}
                rules={[
                  {
                    required: true,
                    message: 'Оберіть категорію'
                  },
                ]}
              >
                <CategorySelector categoryId={selectedCategoryId} onChange={setSelectedCategoryId} />
              </Form.Item>
            </div>

            {selectedCategoryId !== 0 &&
              <div className='white-container'>
                <Form.Item
                  name="filterValues"
                  label={<h6>Характеристики</h6>}
                >
                  <Filters
                    values={filterValues}
                    child={false}
                    onChange={setFilterValues}
                    categoryId={selectedCategoryId} />
                </Form.Item>
              </div>}

            <div className='white-container'>
              <Form.Item
                name='imageFiles'
                label={<h6>Фото</h6>}
                rules={[
                  {
                    required: true,
                    message: 'Оберіть як мінімум одине фото'
                  },
                ]}>
                <ImageUpload files={files} onChange={setFiles} />
              </Form.Item>
            </div>

            <div className='white-container'>
              <Form.Item
                name='description'
                label={<h6>Опис</h6>}
                rules={[
                  {
                    pattern: RegExp('^[A-Z А-Я].*'),
                    message: "Опис повинен починатися з великої букви"
                  },
                  {
                    required: true,
                    message: "Не забудьте заповнити опис"
                  },
                  {
                    min: 40,
                    message: "Введіть щонайменше 40 символів"
                  },
                ]}>
                <TextArea
                  showCount
                  maxLength={9000}
                  placeholder="Опис"
                  style={{ height: 300, resize: 'none' }}
                />
              </Form.Item>
            </div>

            <div className='white-container'>
              <h4>Додаткова інформація</h4>
              <Form.Item
                name='isNew'
                label={<h6>Стан</h6>}>
                <Radio.Group size="large" buttonStyle="solid">
                  <Radio.Button value={true}>Нове</Radio.Button>
                  <Radio.Button value={false}>Вживане</Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name='isVip'
                label={<h6>Статус</h6>}>
                <Radio.Group size="large" buttonStyle="solid">
                  <Radio.Button value={true}>VIP оголошення</Radio.Button>
                  <Radio.Button value={false}>Звичайне</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </div>

            <div className='white-container'>
              <Radio.Group defaultValue={priceFree} onChange={(e) => setPriceFree(e.target.value)} size="large" buttonStyle="solid">
                <Radio.Button value={false}>Ціна</Radio.Button>
                <Radio.Button value={true}>Безкоштовно</Radio.Button>
              </Radio.Group>
              {!priceFree &&
                <>
                  <Form.Item
                    name='price'
                    label={<h6>Ціна за 1 шт.</h6>}
                    rules={[
                      {
                        required: true,
                        message: "Не забудьте заповнити ціну"
                      }
                    ]}>
                    <InputNumber className='no-border no-border-container' addonAfter="грн." size='large' />
                  </Form.Item>
                  <Form.Item
                    valuePropName='checked'
                    name='isContractPrice'
                    label={<h6>Договірна</h6>}>
                    <Switch className=' d-inline' />
                  </Form.Item>
                </>
              }
            </div>

            <div className='white-container'>
              <Form.Item
                name='cityId'
                label={<h6>Місцезнаходження</h6>}
                rules={[
                  {
                    required: true,
                    message: "Не забудьте обрати місцезнаходження"
                  }
                ]}>
                <TreeSelect
                  treeDataSimpleMode
                  treeCheckable={false}
                  size='large'
                  showSearch
                  style={{ width: 300 }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="Оберіть місцезнаходження"
                  allowClear
                  loadData={onLoadData}
                  treeData={treeElements}
                  className='no-border-container search-tree'
                  notFoundContent={
                    <div style={{ textAlign: 'center' }}>
                      <SmileOutlined style={{ fontSize: 20 }} />
                      <p>Дані не знайдені</p>
                    </div>
                  }
                  filterTreeNode={filterTree}
                />
              </Form.Item>
            </div>

            <div className='white-container'>
              <h4>Ваші контактні дані</h4>
              <Form.Item
                name="contactPersone"
                label={<h6>Контактна особа</h6>}
                hasFeedback
                className='fs-3'
                style={{ width: 300 }}
                rules={[
                  {
                    required: true,
                    message: "Не забудьте вказати контактну особу"
                  },
                  {
                    min: 3,
                    message: "Введіть щонайменше 3 символів"
                  },
                ]}
              >
                <Input size='large'
                  className='p-2 no-border no-border-container'
                  placeholder="Контактна особа"
                  showCount minLength={3}
                  maxLength={56} />
              </Form.Item>

              <Form.Item
                name="contactEmail"
                label={<h6>Email-адреса</h6>}
                hasFeedback
                className='fs-3'
                style={{ width: 300 }}>
                <Input
                  size='large'
                  readOnly
                  className='p-2 no-border no-border-container'
                  placeholder="Email-адреса" />
              </Form.Item>
              <Form.Item
                name="phoneNumber"
                label={<h6>Номер телефону</h6>}
                hasFeedback
                className='fs-3'
                style={{ width: 300 }}
                rules={[
                  {
                    required: true,
                    message: "Не забудьте вказати контактний номер телефону"
                  },
                  {
                    pattern: RegExp('^\\d{3}[-\\s]{1}\\d{3}[-\\s]{1}\\d{2}[-\\s]{0,1}\\d{2}$'),
                    message: "Невірно введений телефон!(xxx-xxx-xx-xx) (xxx xxx xx xx) (xxx xxx xxxx) (xxx-xxx-xxxx)",
                  },
                ]}
              >
                <Input
                  size='large'
                  className='p-2 no-border no-border-container'
                  placeholder="Номер телефону" />
              </Form.Item>
            </div>



            <div className='d-flex justify-content-end'>
              <Button loading={publishing} size='large' htmlType="submit">
                Опублікувати
              </Button>
            </div>
          </Form>
        </div>}
      {!loading && error && <Error
        status="500"
        title="Упс...виникла помилка"
        subTitle="Помилка звантаження інформації"
      />}
    </>
  )
}

export default CreateAdvert
