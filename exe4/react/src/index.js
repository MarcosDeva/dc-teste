import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import './Assets/index.css';
import App from './App';
import registerServiceWorker from './Auth/registerServiceWorker';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import $ from '../node_modules/jquery/dist/jquery.min.js';
window.jQuery = $;
window.$ = $;
global.jQuery = $;
require('../node_modules/bootstrap/dist/js/bootstrap.min.js');

ReactDOM.render(
    <BrowserRouter><App /></BrowserRouter>,
    document.getElementById('root')
)
registerServiceWorker();
