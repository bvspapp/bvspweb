import styled from 'styled-components';
import { Form } from '@unform/web';
import TextInput from '../../../components/Form/TextInput';
import Button from '../../../components/Form/Button';
import Select from '../../../components/Form/SelectInput';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  flex-wrap: wrap;
  flex: 1;
`;

export const Header = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;

  margin-top: 15px;
  padding: 0 25px;
`;

export const UserContainer = styled.div``;

export const Content = styled.main`
  flex: 1;
  margin-top: 45px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const BackButton = styled(Button)`
  font-size: 22px;
  width: 50px;
  height: 40px;
`;

export const SearchContainer = styled(Form)`
  width: 100%;
  padding: 20px;

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
  margin-top: 15px;
  height: 40px;
  margin-left: 10px;
`;

export const ClearButton = styled(Button)`
  margin-top: 15px;
  height: 40px;
  margin-left: 5px;
`;

export const ServiceContainer = styled.div`
  padding: 0 20px;
  display: flex;

  flex-wrap: wrap;
  justify-content: center;
`;

export const SelectFilter = styled(Select).attrs({
  containerCustomStyle: {
    marginTop: '16px',
  },
})``;

export const MessageContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;

  margin: 20px;
`;

export const MessageText = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${props => props.theme.colors.tertiary};

  display: flex;
  align-items: center;

  width: 100%;

  &:after {
    content: '';
    margin-left: 7px;
    display: inline-block;
    width: 44%;
    height: 1px;
    background-color: ${props => props.theme.colors.secondary};
  }

  &:before {
    content: '';
    margin-right: 7px;

    width: 44%;
    height: 1px;
    background-color: ${props => props.theme.colors.secondary};
  }
`;

export const PaginationButtons = styled.div`
  width: 100%;

  margin-top: 10px;
  padding-right: 20px;

  display: flex;
  justify-content: flex-end;

  button + button {
    margin-left: 10px;
  }
`;

export const PaginationButton = styled(Button)`
  height: 27px;
`;
