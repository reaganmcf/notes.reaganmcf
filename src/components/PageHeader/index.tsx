import React from 'react';

interface PageHeaderProps {
  title: string;
  date: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, date }) => {
  return (
    <div className="w-full bg-black">
      <p className="text-xs">{title}</p>
      <p>{date}</p>
    </div>
  );
}

export default PageHeader;
