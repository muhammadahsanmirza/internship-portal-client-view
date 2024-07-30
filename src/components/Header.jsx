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
    <div className="flex flex-col mt-10 sm:border-b-2 border-gray-300 ml-2 sm:ml-10 sm:px-10 py-2 sm:py-3 ">
      <p className="font-bold text-base sm:text-lg  sm:leading-snug">
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
