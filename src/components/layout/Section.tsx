import React from 'react';
import Container from './Container';

interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'sm' | 'base' | 'lg' | 'xl';
  background?: 'transparent' | 'glass' | 'gradient';
}

const Section: React.FC<SectionProps> = ({
  children,
  id,
  className = '',
  containerSize = 'xl',
  padding = 'lg',
  background = 'transparent'
}) => {
  const paddingClasses = {
    sm: 'py-8',
    base: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  };

  const backgroundClasses = {
    transparent: '',
    glass: 'glass-effect',
    gradient: 'bg-gradient-to-b from-transparent via-blue-900/5 to-transparent'
  };

  const classes = [
    'relative',
    paddingClasses[padding],
    backgroundClasses[background],
    className
  ].filter(Boolean).join(' ');

  return (
    <section id={id} className={classes}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  );
};

export default Section;