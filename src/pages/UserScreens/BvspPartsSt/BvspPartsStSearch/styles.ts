import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Form } from '@unform/web';
import TextInput from '../../../../components/Form/TextInput';
import Button from '../../../../components/Form/Button';
import Select from '../../../../components/Form/SelectInput';

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

export const PdfButton = styled.a`
  width: 50px;
  height: 40px;
  line-height: 50px;
  border-radius: 5px;

  margin-left: 10px;
  text-align: center;

  font-size: 22px;
  background-color: ${props => props.theme.colors.success};
  color: ${props => props.theme.colors.white};

  transition: opacity 0.3s;

  &:hover {
    opacity: 0.7;
  }
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
  margin-top: 18px;
  height: 40px;
  margin-left: 10px;
`;

export const ClearButton = styled(Button)`
  margin-top: 18px;
  height: 40px;
  margin-left: 5px;
`;

export const SelectFilter = styled(Select).attrs({
  containerCustomStyle: {
    marginTop: '19px',
  },
})``;

export const ProductContainer = styled.div`
  padding: 0 20px;
  display: flex;

  flex-wrap: wrap;
  justify-content: center;
`;

export const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
`;

export const MachineName = styled.p`
  font-weight: bold;
  font-size: 14px;
  color: ${props => props.theme.colors.tertiary};
  margin-top: 15px;
`;

export const HeaderRight = styled.div`
  display: flex;
`;
