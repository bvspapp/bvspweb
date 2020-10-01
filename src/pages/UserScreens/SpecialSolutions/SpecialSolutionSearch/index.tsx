import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiSearch, FiX } from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
import ProductCard from '../../../../components/ProductCard';
import MessageAlert from '../../../../utils/MessageAlert';
import Load from '../../../../components/Load';

import {
  Container,
  Header,
  Content,
  BackButton,
  SearchContainer,
  SearchInput,
  SearchButton,
  ClearButton,
  ProductContainer,
} from './styles';

interface IData {
  id: string;
  bvspcode: string;
  description: string;
  photos: {
    url: string;
  }[];
}

interface IDataSearch {
  searchValue: string;
}

const SpecialSolutionSearch: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const handleFetchSpecialSolutions = useCallback(async (data: IDataSearch) => {
    const { searchValue } = data;

    setLoading(true);

    const valueFormatted = searchValue.toLowerCase().trim();

    await firebase
      .firestore()
      .collection('special-solutions')
      .orderBy('description_insensitive')
      .startAt(valueFormatted)
      .endAt(`${valueFormatted}\uf8ff`)
      .get()
      .then(snapshot => {
        const dataFormatted = snapshot.docs.map(doc => {
          return {
            id: String(doc.id),
            bvspcode: String(doc.data().bvspcode),
            description: String(doc.data().description),
            photos: doc.data().photos,
          };
        });

        setDataTable(dataFormatted);
      })
      .catch(() => MessageAlert('Não foi possível carregar os dados!', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchSpecialSolutions({
      searchValue: '',
    });
  }, [handleFetchSpecialSolutions]);

  useEffect(() => {
    handleFetchSpecialSolutions({
      searchValue: '',
    });
  }, [handleFetchSpecialSolutions]);

  return (
    <Container>
      <Header>
        <HighlightTitle title="Soluções Especiais" lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchSpecialSolutions}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />
        <SearchButton type="submit" color={light.colors.success}>
          <FiSearch />
        </SearchButton>
        <ClearButton
          type="button"
          color={light.colors.tertiary}
          onClick={handleSearchClear}
        >
          <FiX />
        </ClearButton>
      </SearchContainer>

      {loading ? (
        <Load />
      ) : (
        <ProductContainer>
          {dataTable.map(solution => (
            <ProductCard
              key={solution.id}
              link={`/specialsolution/${solution.id}`}
              title={solution.description}
              image={solution.photos[0].url}
            />
          ))}
        </ProductContainer>
      )}

      <Content />
    </Container>
  );
};

export default SpecialSolutionSearch;
