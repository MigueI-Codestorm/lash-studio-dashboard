
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '' }: CardProps) => {
  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-lg p-6 shadow-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
