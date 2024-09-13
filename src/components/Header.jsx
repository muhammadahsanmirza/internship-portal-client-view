/* eslint-disable react/prop-types */
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
    <div className="flex flex-col mt-14 sm:mt-14 pb-2 border-gray-300  border-b-2  px-8 lg:mt-0 lg:px-4 lg:pt-1 ">
      <p className="font-bold text-base sm:text-lg  sm:leading-snug">
        College of Engineering Internship
      </p>
      <div className="pb-1">
        <Breadcrumbs separator="/" mt="xs">
          {items}
        </Breadcrumbs>
      </div>
    </div>
  );
}

export default Header;
