import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; // Full height for centering
  position: absolute; // To position it above other content
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3; 
`;

const LoaderCircle = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid #007bff; // Customize the color
  border-radius: 50%;
  width: 60px;
  height: 60px; 
  animation: ${spin} 1s linear infinite; 
`;

const Loader = () => {
  return (
    <LoaderContainer>
      <LoaderCircle />
    </LoaderContainer>
  );
};

export default Loader;
