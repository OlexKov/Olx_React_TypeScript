import { Image, Button, DatePicker, Divider, Form,  Input, message, Upload, UploadFile, UploadProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import './Registration.css'
import { accountService } from '../../../services/accountService'
import BackButton from '../../common-components/BackButton'
import { UserRegisterModel } from '../../../models/UserRegisterModel'
import { useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { FileType, getBase64 } from '../../../helpers/common-methods'

export const Registration: React.FC = () => {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);


  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Аватар</div>
    </button>
  );

  const onFinish = async (user: UserRegisterModel) => {
    user.birthdate = new Date(user.birthdate).toISOString();
    user.avatarFile = fileList[0]?.originFileObj || null
    const responce = await accountService.register(user);
    if (responce.status === 200) {
     message.success(`Юзер "${user.name} ${user.surname}" успішно зареєстрований`)
     navigate('/')
    }
  }
  return (
    <>

      <BackButton />
      
      <div className=' w-75 mx-auto d-flex flex-column mb-4 align-items-center'>
        <Divider className='fs-3  mb-5' orientation="left">Реєстрація</Divider>
        <Upload
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
            >
              {fileList.length > 0 ? null : uploadButton}
            </Upload>
            {previewImage && (
              <Image
                wrapperStyle={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
        <Form
          layout='vertical'
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          className='w-100'
        >
          
          <Form.Item
            name="name"
            label="Ім'я"
            hasFeedback
          
            rules={[
              {
                pattern: RegExp('^[A-Z А-Я].*'),
                message: "Ім'я повинно починатися з великої букви"
              },
              {
                required: true,
                message: "Введіть і'мя"
              },
            ]}
          >
            <Input placeholder="Ваше ім'я" showCount minLength={3} maxLength={100} />
          </Form.Item>
          <Form.Item
            name="surname"
            label="Прізвище"
            hasFeedback
            rules={[
              {
                pattern: RegExp('^[A-Z А-Я].*'),
                message: "Прізвище повинно починатися з великої букви"
              },
              {
                required: true,
                message: 'Ведіть прізвище'
              },
            ]}
          >
            <Input placeholder="Ваше прізвище" showCount minLength={3} maxLength={100} />
          </Form.Item>
          <Form.Item
            name="birthdate"
            label="Дата народження"
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Оберіть дату народження'
              },
            ]}
          >
            <DatePicker placeholder="Дата народження" className='w-100' disabledDate={d => !d || d.isAfter(new Date(Date.now()))} />
          </Form.Item>
          <Form.Item
            hasFeedback
            label="Електронна пошта"
            name="email"
            rules={[
              {
                required: true,
                message: "Будьласка введіть пошту!",
              },
              {
                type: 'email',
                message: "Невірно введена пошта!",
              },
            ]}
          >
            <Input placeholder='Будьласка введіть пошту' />
          </Form.Item>

          <Form.Item

            label="Телефон"
            name="phoneNumber"
            rules={[
              {
                pattern: RegExp('^\\d{3}[-\\s]{1}\\d{3}[-\\s]{1}\\d{2}[-\\s]{0,1}\\d{2}$'),
                message: "Невірно введений телефон!(xxx-xxx-xx-xx) (xxx xxx xx xx) (xxx xxx xxxx) (xxx-xxx-xxxx)",
              },
            ]}
          >
            <Input placeholder='Ваш тедефон ' />
          </Form.Item>

          <Form.Item
            hasFeedback
            label="Пароль"
            name="password"
            rules={[
              {
                required: true,
                message: 'Будьласка введіть пароль!',
              },
              {
                pattern: RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\\w\\s]|[_])).{6,}$'),
                message: 'Невірний пароль...!',
              },
              {
                min: 6,
                message: 'Пароль має містити не менше 6 символів!',
              },
              {
                max: 16,
                message: 'Пароль має містити не більше 16 символів!',
              },

            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Підтвердіть пароль"
            dependencies={['password']}
            name='confirmation'
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Будьласка підтвердіть ваш пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Пароль підтвердження не співпадає з введенним паролем!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <div className='buttons-block'>
            <Button type="primary" htmlType="submit">
              Зареєструватися
            </Button>
            <Link to="/login">
              <Button >Увійти</Button>
            </Link>
          </div>
        </Form>
      </div>
    </>
  )
}