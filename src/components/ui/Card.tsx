import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'premium';
  padding?: 'sm' | 'base' | 'lg' | 'xl';
  hover?: boolean;
  className?: string;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'base',
  hover = true,
  className = ''
}) => {
  const baseClasses = 'card';
  const variantClasses = {
    default: '',
    premium: 'card-premium'
  };
  const paddingClasses = {
    sm: 'p-4',
    base: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hover ? 'hover-lift' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h3 className={`text-xl font-semibold text-white gradient-text ${className}`}>
    {children}
  </h3>
);

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

const CardDescription: React.FC<CardDescriptionProps> = ({ children, className = '' }) => (
  <p className={`text-gray-300 mt-2 ${className}`}>
    {children}
  </p>
);

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`mt-6 pt-4 border-t border-gray-700 ${className}`}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };