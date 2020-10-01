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
  FiArrowRight,
  FiArrowLeft,
} from 'react-icons/fi';

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
  SelectFilter,
  ProductContainer,
  PaginationButton,
  PaginationButtons,
} from './styles';

interface IDataSearch {
  searchValue: string;
  filterValue: string;
}

interface IData {
  id: string;
  bvspcode: string;
  description: string;
  photos: {
    url: string;
  }[];
}

const BvspMachineSearch: React.FC = () => {
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

  const pageSize = 10;
  const history = useHistory();

  const optionsSearchFilterBvspPart = useMemo(() => {
    return [
      {
        value: 'description_insensitive',
        label: 'Nome',
      },
      {
        value: 'bvspcode',
        label: 'Código BVSP',
      },
    ];
  }, []);

  const handleFetchBvspMachines = useCallback(async (data: IDataSearch) => {
    const { searchValue, filterValue } = data;

    setLoading(true);

    const valueFormatted = searchValue.toLowerCase().trim();
    setLastValueConsulted(valueFormatted);
    setLastFilterConsulted(filterValue);

    await firebase
      .firestore()
      .collection('machines')
      .where('type', '==', 'bvsp-machine')
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
              .collection('machines')
              .where('type', '==', 'bvsp-machine')
              .orderBy(lastFilterConsulted)
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .startAfter(lastDocPaginate)
              .limit(pageSize)
          : firebase
              .firestore()
              .collection('machines')
              .where('type', '==', 'bvsp-machine')
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

    handleFetchBvspMachines({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspMachines]);

  useEffect(() => {
    handleFetchBvspMachines({
      searchValue: '',
      filterValue: 'description_insensitive',
    });
  }, [handleFetchBvspMachines]);

  return (
    <Container>
      <Header>
        <HighlightTitle title="Máquinas" lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchBvspMachines}>
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
            {dataTable.map(machine => (
              <ProductCard
                key={machine.id}
                link={`/bvspmachine/${machine.id}`}
                title={machine.description}
                image={machine.photos[0].url}
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

export default BvspMachineSearch;
