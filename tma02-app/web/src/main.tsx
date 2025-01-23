/**
 * @fileoverview This is the main entry point for the React application.
 * 
 * Version history
 * 1.0, 18 January 2024, A Thomson, Intial version
 */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '../../App.tsx'
// Bugfix: removed the default css to improve rendering of ReactNative components
// Autumn Thomson 19/01/2024
//import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
