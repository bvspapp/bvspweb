import styled from 'styled-components';
import { Form } from '@unform/web';
import DataTable from 'react-data-table-component';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Form/Button';

export const Container = styled.div``;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  margin-bottom: 30px;
`;

export const Title = styled.h2``;

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

export const Table = styled(DataTable)``;

export const SelectButton = styled.button`
  background: none;
  border: none;

  font-size: 20px;
  color: ${props => props.theme.colors.primary};

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.8;
  }
`;

export const CloseButton = styled.button`
  background: none;

  font-size: 24px;

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
`;
