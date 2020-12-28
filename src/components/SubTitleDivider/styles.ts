import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  text-align: center;
  border-bottom: 1px solid ${props => props.theme.colors.secondary};
  line-height: 0.1em;
  margin: 10px 0 20px;
`;

export const Text = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.colors.tertiary};

  position: relative;
  background-color: ${props => props.theme.colors.white};
  padding: 0 10px;
`;
