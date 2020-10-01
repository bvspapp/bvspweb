import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import {
  FiSearch,
  FiFilter,
  FiX,
  FiArrowLeft,
  FiArrowRight,
} from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';
import Load from '../../../../components/Load';

import HighlightTitle from '../../../../components/HighlightTitle';
import ProductCard from '../../../../components/ProductCard';
import MessageAlert from '../../../../utils/MessageAlert';

import {
  Container,
  Header,
  Content,
  BackButton,
  SearchContainer,
  SearchInput,
  SearchButton,
  ClearButton,
  SelectFilter,
  ProductContainer,
  PaginationButtons,
  PaginationButton,
} from './styles';

interface IData {
  id: string;
  oemcode: string;
  bvspcode: string;
  description: string;
  photos: {
    url: string;
  }[];
}

interface IDataSearch {
  searchValue: string;
  filterValue: string;
}

const BvspPartsStSearch: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastValueConsulted, setLastValueConsulted] = useState<string>();
  const [lastFilterConsulted, setLastFilterConsulted] = useState<string>(
    'description_insensitive',
  );
  const [lastDocPaginate, setLastDocPaginate] = useState<
    firebase.firestore.QueryDocumentSnapshot
  >();
  const [pageNumber, setPageNumber] = useState(1);
  const [existsMoreRecords, setExistsMoreRecords] = useState(false);
  const [firstDocPaginate, setFirstDocPaginate] = useState<
    firebase.firestore.QueryDocumentSnapshot
  >();

  const formRef = useRef<FormHandles>(null);

  const pageSize = 8;
  const history = useHistory();

  const optionsSearchFilterBvspPart = useMemo(() => {
    return [
      {
        value: 'oemcode',
        label: 'Código OEM',
      },
      {
        value: 'bvspcode',
        label: 'Código BVSP',
      },
      {
        value: 'description_insensitive',
        label: 'Nome',
      },
    ];
  }, []);

  const handleFetchBvspPart = useCallback(async (data: IDataSearch) => {
    const { searchValue, filterValue } = data;

    setLoading(true);

    const valueFormatted = searchValue.toLowerCase().trim();
    setLastValueConsulted(valueFormatted);
    setLastFilterConsulted(filterValue);

    await firebase
      .firestore()
      .collection('parts')
      .orderBy(filterValue)
      .startAt(valueFormatted)
      .endAt(`${valueFormatted}\uf8ff`)
      .limit(pageSize)
      .get()
      .then(snapshot => {
        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        setLastDocPaginate(lastVisible);

        const firstVisible = snapshot.docs[0];
        setFirstDocPaginate(firstVisible);

        // show or unshow next button.
        snapshot.docs.length === pageSize
          ? setExistsMoreRecords(true)
          : setExistsMoreRecords(false);

        const dataFormatted = snapshot.docs.map(doc => {
          return {
            id: String(doc.id),
            oemcode: String(doc.data().oemcode),
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

  const handlePagination = useCallback(
    async (action: 'prev' | 'next') => {
      setLoading(true);

      if (action === 'next') {
        setPageNumber(prevState => prevState + 1);
      } else {
        setPageNumber(prevState => prevState - 1);
      }

      const query =
        action === 'next'
          ? firebase
              .firestore()
              .collection('parts')
              .orderBy(lastFilterConsulted)
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .startAfter(lastDocPaginate)
              .limit(pageSize)
          : firebase
              .firestore()
              .collection('parts')
              .orderBy(lastFilterConsulted)
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .endBefore(firstDocPaginate)
              .limitToLast(pageSize);

      query
        .get()
        .then(snapshot => {
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          const firstVisible = snapshot.docs[0];

          if (snapshot.docs.length === pageSize) {
            setLastDocPaginate(lastVisible);
            setExistsMoreRecords(true);
          } else {
            setExistsMoreRecords(false);
            setPageNumber(prevState => prevState - 1);
          }

          if (firstVisible) {
            setFirstDocPaginate(firstVisible);
          }

          const dataFormatted = snapshot.docs.map(doc => {
            return {
              id: String(doc.id),
              oemcode: String(doc.data().oemcode),
              bvspcode: String(doc.data().bvspcode),
              description: String(doc.data().description),
              photos: doc.data().photos,
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() =>
          MessageAlert('Não foi possível carregar os dados!', 'error'),
        )
        .finally(() => setLoading(false));
    },
    [
      firstDocPaginate,
      lastDocPaginate,
      lastFilterConsulted,
      lastValueConsulted,
    ],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchBvspPart({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspPart]);

  useEffect(() => {
    handleFetchBvspPart({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspPart]);

  return (
    <Container>
      <Header>
        <HighlightTitle title="Peças Linhas ST" lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchBvspPart}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder="Pesquisar..."
        />
        <SelectFilter
          name="filterValue"
          icon={FiFilter}
          options={optionsSearchFilterBvspPart}
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
        <>
          <ProductContainer>
            {dataTable.map(part => (
              <ProductCard
                key={part.id}
                title={part.description}
                image={part.photos[0].url}
                link={`/part/${part.id}`}
              />
            ))}
          </ProductContainer>

          <PaginationButtons>
            {pageNumber > 1 && (
              <PaginationButton
                type="button"
                color={light.colors.success}
                onClick={() => handlePagination('prev')}
              >
                <FiArrowLeft />
              </PaginationButton>
            )}

            {existsMoreRecords && (
              <PaginationButton
                type="button"
                color={light.colors.success}
                onClick={() => handlePagination('next')}
              >
                <FiArrowRight />
              </PaginationButton>
            )}
          </PaginationButtons>
        </>
      )}

      <Content />
    </Container>
  );
};

export default BvspPartsStSearch;
