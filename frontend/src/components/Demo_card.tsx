import React from 'react';
import { Ai_Demo } from './Ai_Demo';
import { useModal } from '../context/ModalContext';
import { Modal } from './Modal';
import ComingSoon from './ComingSoon';

interface CardData {
  title: string;
  description: string;
  component: React.ReactNode;
}

const Card: React.FC = () => {
  const { openModal } = useModal();
  
  const cardData: CardData[] = [
    { 
      title: 'Content Magic',
      description: 'Generate professional & unic Content Magic with AI',
      component: <Ai_Demo />
    },
    { 
      title: 'AI Assistant',
      description: 'Your personal AI powered assistant',
      component: <ComingSoon />
    },
    { 
      title: 'Code Generator',
      description: 'Generate code snippets instantly',
      component: <ComingSoon />
    },
  ];

  const handleCardClick = (data: CardData) => {
    openModal(data.component);
  };

  const renderCard = (data: CardData) => (
    <div className="flex flex-col items-center space-y-6">
      {/* Professional Outer Heading */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
          {data.title}
        </h3>
        <p className="text-blue-200/80 text-sm max-w-xs leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Card Container */}
      <div
        className="group relative h-[300px] w-[230px] cursor-pointer transform transition-transform duration-300 hover:scale-105"
        onClick={() => handleCardClick(data)}
      >
      {/* Box Shadow Layer */}
      <div
        className="absolute h-full w-full border border-cyan-500 scale-[0.8] transition-all duration-500"
        style={{
          boxShadow: 'rgb(0, 102, 255) 0px 30px 70px 0px',
          transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
        }}
      />

      {/* Main Card */}
      <div
        className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[rgb(30,58,138)] via-[rgb(6,182,212)] via-60% to-[rgb(30,58,138)] transition-all duration-300 group-hover:scale-110"
        style={{
          clipPath: 'polygon(0 0, 100% 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px))',
          boxShadow: 'rgb(0, 102, 255) 0px 7px 29px 0px',
          transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
        }}
      >
        {/* Top Triangle */}
        <div 
          className="absolute top-0 left-0 w-0 h-0 z-[2] transition-all duration-500 group-hover:-top-[50px]"
          style={{
            borderTop: '115px solid black',
            borderLeft: '115px solid transparent',
            borderRight: '115px solid transparent',
            transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
          }}
        />
        
        {/* Left Side */}
        <div 
          className="absolute w-full top-0 left-0 -translate-x-1/2 h-[101%] bg-black transition-all duration-500 delay-100 group-hover:-left-[50px]"
          style={{
            clipPath: 'polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%)',
            transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
          }}
        />
        
        {/* Right Side */}
        <div 
          className="absolute w-full top-0 right-0 translate-x-1/2 scale-x-[-1] h-[101%] bg-black transition-all duration-500 delay-100 group-hover:-right-[50px]"
          style={{
            clipPath: 'polygon(0% 0%, 50% 0, 95% 45%, 100% 100%, 0% 100%)',
            transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)'
          }}
        />
        
        {/* Title */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[90px] font-bold text-[25px] text-center opacity-0 -z-[1] transition-all duration-200 delay-0 group-hover:opacity-100 group-hover:delay-[1300ms]">
          {data.title}
        </div>
        
        {/* Button Container */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2">
          {/* Instagram Button */}
          <button 
            onClick={(e) => e.stopPropagation()}
            className="absolute -translate-x-1/2 px-[10px] py-[5px] bg-black border-none text-white grid place-content-center transition-all duration-500 bottom-[300px] group-hover:bottom-[80px] group-hover:delay-[800ms] hover:scale-110"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 81% 100%, 21% 100%)',
              transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
              transitionDelay: '0.4s'
            }}
          >
            <svg
              className="w-[15px] transition-all duration-200 hover:scale-[1.2] active:scale-[0.7]"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="cyan"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
            </svg>
          </button>
          
          {/* Twitter/X Button */}
          <button 
            onClick={(e) => e.stopPropagation()}
            className="absolute -translate-x-1/2 px-[10px] py-[5px] bg-black border-none text-white grid place-content-center transition-all duration-500 bottom-[300px] group-hover:bottom-[40px] group-hover:delay-[600ms] hover:scale-110"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 81% 100%, 21% 100%)',
              transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
              transitionDelay: '0.6s'
            }}
          >
            <svg
              className="w-[15px] transition-all duration-200 hover:scale-[1.2] active:scale-[0.7]"
              xmlns="http://www.w3.org/2000/svg"
              height="24"
              width="24"
              fill="cyan"
              viewBox="0 0 512 512"
            >
              <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
            </svg>
          </button>
          
          {/* GitHub Button */}
          <button 
            onClick={(e) => e.stopPropagation()}
            className="absolute -translate-x-1/2 px-[10px] py-[5px] bg-black border-none text-white grid place-content-center transition-all duration-500 bottom-[300px] group-hover:bottom-0 group-hover:delay-[400ms] hover:scale-110"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 81% 100%, 21% 100%)',
              transitionTimingFunction: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
              transitionDelay: '0.8s'
            }}
          >
            <svg
              className="w-[15px] transition-all duration-200 hover:scale-[1.2] active:scale-[0.7]"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="cyan"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
          </button>
        </div>
      </div>

      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-20 px-4">
      {cardData.map((data, i) => (
        <div key={i} className="w-full md:w-auto flex justify-center">
          {renderCard(data)}
        </div>
      ))}
    </div>
  );
};

// Wrap the Card component with Modal
const DemoCard: React.FC = () => {
  return (
    <>
      <Card />
      <Modal />
    </>
  );
};

export default DemoCard;
