import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { LoginModel } from '../../../models/LoginModel';
import { accountService } from '../../../services/accountService';
import BackButton from '../../common-components/BackButton';
import { Button, Checkbox, Divider, Form, Input, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { storageService } from '../../../services/storangeService';
import user from '../../../stores/UserStore'

export const Login: React.FC = () => {
    const [remember, setRemember] = useState<boolean>(false);
    const navigate = useNavigate()

    const onFinish = async (loginModel: LoginModel) => {
        const responce = await accountService.login(loginModel);
        if (responce.status === 200) {
            if (remember) {
                storageService.saveTokens(responce.data.accessToken);
            }
            else {
                storageService.setTemporalyTokens(responce.data.accessToken)
            }
            user.setUserData(responce.data.accessToken)
            navigate('/')
            message.success('Ви успішно увійшли в свій акаунт')
        }
    }
    return (
        <>
        <div className=' w-70 mx-auto my-4'>
            <BackButton />
        </div>
           
            <div className='w-50 mx-auto'>
                <Divider className='fs-3 border-dark-subtle mb-5' orientation="left">Логін</Divider>
                <Form
                    layout='vertical'
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    className='mx-auto'
                >
                    <Form.Item
                        label="Електронна пошта"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: "Будьласка введіть логін!",
                            },
                            {
                                type: 'email',
                                message: "Невірно введена пошта!",
                            },
                        ]}
                    >
                        <Input type='large' />
                    </Form.Item>

                    <Form.Item
                        label="Пароль"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Будьласка введіть пароль!',
                            },
                        ]}
                    >
                        <Input.Password  type='large' />
                    </Form.Item>

                    <Form.Item
                         name='remember'>
                        <Checkbox onChange={(e: CheckboxChangeEvent) => setRemember(e.target.checked)}>Запам'ятати мене</Checkbox>
                    </Form.Item>
                    <div className='buttons-block'>
                        <Button type="primary" htmlType="submit">
                            Увійти
                        </Button>
                        <Link to="/registration">
                            <Button >Реєстрація</Button>
                        </Link>
                        <Link to='/fogotpassword'>Забули раполь?</Link>
                    </div>
                </Form>
            </div>

        </>
    )
}
