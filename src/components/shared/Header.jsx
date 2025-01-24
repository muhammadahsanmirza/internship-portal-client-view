/* eslint-disable react/prop-types */
import { useId } from 'react';
import { Breadcrumbs } from '@mantine/core';
import { Link } from 'react-router-dom';
function Header({ breadcrumbs }) {
  const id = useId();
  const items = breadcrumbs.map((item) => (
    <Link
      to={item.href}
      key={id}
      className={`text-sm ${item.isDisabled ? 'text-gray-500 cursor-default' : 'text-blue-950'}`}
      style={{ pointerEvents: item.isDisabled ? 'none' : 'auto' }}
    >
      {item.title}
    </Link>
  ));

  return (
    <div className="flex flex-col mt-14 sm:mt-14 pb-2 border-gray-300  border-b-2    lg:mt-0 pl-7 md:pl-8 px-4 md:px-4 lg:px-7 lg:pt-1 h-18">
      <p className="font-bold text-base sm:text-lg  sm:leading-snug">
        College of Engineering Internship
      </p>
      <div className="pb-[3px]">
        <Breadcrumbs separator="/" mt="xs">
          {items}
        </Breadcrumbs>
      </div>
    </div>
  );
}

export default Header;
