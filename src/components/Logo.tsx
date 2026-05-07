import React from 'react';

interface LogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const Logo: React.FC<LogoProps> = (props) => {
  return (
    <img 
      src="/logo.jpeg" 
      alt="Körperfluss Logo" 
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
