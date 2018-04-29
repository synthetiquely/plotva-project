import React from 'react';
import './Icon.css';

export const Icon = ({ type, onClick }) => <span onClick={onClick} className={`icon icon_${type}`} />;
