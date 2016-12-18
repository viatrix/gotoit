import React from 'react';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl';

//import $ from "jquery";
//window.jQuery = jQuery = window.$ = $;
//console.log($);

import App from './App';
import './index.css';

ReactDOM.render(
    <IntlProvider locale="en">
        <App />
    </IntlProvider>,
  document.getElementById('root')
);
