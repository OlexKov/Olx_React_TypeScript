import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { Registration } from './components/user/registration';
import { Login } from './components/user/login';
import Error from './components/Error'
import HomePage from './components/home-page';
import UserProtectedRoute from './components/protected-routes/UserProtectedRoute';
import FavoriteAdverts from './components/user/favorite-adverts';
import UserAccount from './components/user/user-account';
import UserAdverts from './components/user/user-adverts';
import Layout from './components/Layout';
import CreateAdvert from './components/advert/create-advert';
import AdvertPage from './components/advert';



const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/favorites" element={<FavoriteAdverts />} />
        <Route path="/create-advert" element={
          <UserProtectedRoute children={<CreateAdvert />} />
        } />
        <Route path="/account" element={
          <UserProtectedRoute children={<UserAccount />} />
        } />
        <Route path="/useradverts" element={
          <UserProtectedRoute children={<UserAdverts />} />
        } />
        <Route path='/main-search' element={<HomePage />} />
        <Route path='/advert' element={<AdvertPage />} />
        <Route path='/registration' element={<Registration />} />
        <Route path='/login' element={<Login />} />
        <Route path="*" element={
          <Error
            status="404"
            title="404"
            subTitle="Вибачте, сторінкт на яку ви намагаєтесь перейти не існує."
          />} />
        <Route path="forbiden" element={
          <Error
            status="403"
            title="403"
            subTitle="В доступі відмовлено.Ви не маєте дозволу для доступу до цієї сторінки."
          />} />
      </Route>
    </Routes>
  );
};

export default App;
