import styled, { keyframes } from 'styled-components';
import bgtexture from '../../assets/bgtexture.svg';

const inputAnimation = keyframes`
    0% {
        transform: translateX(100px);
        opacity: 0;
    }
    50%{
        opacity: .3;
    }
    100%{
        transform: translateX(0px);
        opacity: 1;
    }
`;

/**
 * Layout Application when User is Logged.
 * FM = Float Menu
 * CT = Content
 */

export const Grid = styled.div`
  display: grid;

  grid-template-columns: 160px auto;
  grid-template-rows: auto;

  grid-template-areas: 'FM CT';

  height: 100vh;
  padding: 20px;

  background: ${props => props.theme.colors.secondary};

  @media (max-width: 600px) {
    grid-template-columns: 100%;
    grid-template-rows: 70px auto;
    grid-template-areas:
      'FM'
      'CT';
  }
`;

export const Content = styled.main`
  grid-area: CT;

  height: calc(100vh - 40px);

  overflow-y: scroll;

  background: ${props => props.theme.colors.white};
  border-radius: 10px;

  background-image: linear-gradient(
      to top,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.73)
    ),
    url(${bgtexture});

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #c9c9c9;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: ${props => props.theme.colors.secondary};
  }

  animation: ${inputAnimation} 0.5s;
`;
