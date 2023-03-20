import React from 'react';
import ReactDom from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChainId, ThirdwebProvider } from '@thirdweb-dev/react';
import './index.css'
import { StateContextProvider } from './context';
const root = ReactDom.createRoot(document.getElementById('root'));

import App from './App';

root.render(
    <ThirdwebProvider activeChain="goerli">
        <Router>
            <StateContextProvider>
                <App />
            </StateContextProvider>
        </Router>
    </ThirdwebProvider>
)
