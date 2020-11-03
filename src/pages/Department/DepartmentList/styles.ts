import styled from 'styled-components';
import { Form } from '@unform/web';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Form/Button';

export const Container = styled.div``;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  margin-bottom: 30px;
`;

export const Content = styled.div``;

export const Title = styled.h2``;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  > button {
    margin-left: 7px;
  }
`;

export const SearchContainer = styled(Form)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SearchInput = styled(TextInput).attrs({
  containerCustomStyle: {
    flex: 1,
    marginRight: '10px',
  },
})``;

export const SearchButton = styled(Button)`
  height: 40px;
  margin-left: 10px;
`;

export const ClearButton = styled(Button)`
  height: 40px;
  margin-left: 5px;
`;

export const SearchControllers = styled.div`
  display: flex;
  align-items: center;
  margin-top: 19px;
`;
