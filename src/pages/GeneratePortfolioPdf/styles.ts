import styled from 'styled-components';

export const Container = styled.div``;

export const Header = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  margin-bottom: 15px;
`;

export const Title = styled.h2``;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    margin-left: 7px;
  }
`;

export const Content = styled.div``;

export const FileNotFound = styled.p`
  text-align: center;

  margin-top: 100px;
`;

export const PdfContent = styled.embed`
  width: 100%;
  height: 75vh;
`;
