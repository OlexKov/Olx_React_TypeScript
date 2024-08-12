// src/components/Layout.tsx
import React from 'react';
import Footer from './Footer';
import Header from './Header';
import MainContent from './Content';

const Layout: React.FC = () => {
    return (
        <div className=' bg-main'>
            <Header />
                <MainContent />
            <Footer />
        </div>
    );
};

export default Layout;
