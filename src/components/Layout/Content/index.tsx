// src/components/MainContent.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const MainContent: React.FC = () => {
    return (
        <main>
             <Outlet />
        </main>
    );
};

export default MainContent;
