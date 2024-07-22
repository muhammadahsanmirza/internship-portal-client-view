// Header.jsx
import React from 'react';
import { Breadcrumbs } from '@mantine/core';
import { Link } from 'react-router-dom';

function Header({ breadcrumbs }) {
  const items = breadcrumbs.map((item, index) => (
    <Link
      to={item.href}
      key={index}
      className={`text-sm ${item.isDisabled ? 'text-gray-500 cursor-default' : 'text-blue-950'}`}
      style={{ pointerEvents: item.isDisabled ? 'none' : 'auto' }}
    >
      {item.title}
    </Link>
  ));

  return (
    <div className="flex flex-col border-b-2 border-gray-300 px-10 py-3" style={{ height: '4.1rem' }}>
      <p className="font-bold text-sm" style={{ fontSize: '1rem', lineHeight: '1.25rem' }}>
        College of Engineering Internship
      </p>
      <div className="pb-2">
        <Breadcrumbs separator="/" mt="xs">
          {items}
        </Breadcrumbs>
      </div>
    </div>
  );
}

export default Header;
