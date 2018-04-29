import React from 'react';
import './Layout.css';

export const Layout = ({ header, content, footer }) => (
  <div className="layout">
    {header && <header className="layout__header">{header}</header>}

    {content && <main className="layout__content">{content}</main>}

    {footer && <footer className="layout__footer">{footer}</footer>}
  </div>
);
