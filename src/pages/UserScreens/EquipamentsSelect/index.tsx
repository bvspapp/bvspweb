import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

import HighlightTitle from '../../../components/HighlightTitle';
import SimpleSelectCard from '../../../components/SimpleSelectCard';
import Pagination from '../../../components/Pagination';
import SubTitleDivider from '../../../components/SubTitleDivider';
import MessageAlert from '../../../utils/MessageAlert';
import Load from '../../../components/Load';

import {
  Container,
  Header,
  Content,
  BackButton,
  SearchContainer,
  SearchInput,
  SearchButton,
  ClearButton,
  ServiceContainer,
  SelectFilter,
} from './styles';

interface IRouteParams {
  match: {
    params: {
      department_id: string;
      to: string;
    };
  };
}

interface IDataSearch {
  searchValue: string;
  filterValue: string;
}

interface IData {
  id: string;
  description: string;
}

const EquipamentsSelect: React.FC<IRouteParams> = ({ match }) => {
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

  const pageSize = 6;
  const history = useHistory();
  const { department_id, to } = match.params;

  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const optionsSearchFilterBvspPart = useMemo(() => {
    return [
      {
        value: translated.filter_value_name,
        label: translated.filter_label_name,
      },
      {
        value: 'bvspcode',
        label: translated.filter_label_bvspcode,
      },
    ];
  }, [translated]);

  const handleFetchMachines = useCallback(
    async (data: IDataSearch) => {
      const { searchValue, filterValue } = data;

      const machinesIdWithChecklists: string[] = [];

      if (to === 'checklistdetails') {
        await firebase
          .firestore()
          .collection('checklists')
          .get()
          .then(async snapshot =>
            snapshot.forEach(doc =>
              machinesIdWithChecklists.push(String(doc.data().machines)),
            ),
          );
      }

      setLoading(true);

      const valueFormatted = searchValue.toLowerCase().trim();
      setLastValueConsulted(valueFormatted);
      setLastFilterConsulted(filterValue);

      await firebase
        .firestore()
        .collection('machines')
        .where('departments', 'array-contains', department_id)
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
              description:
                translation === 'en-us'
                  ? String(doc.data().description_english)
                  : String(doc.data().description),
              photos: doc.data().photos,
            };
          });

          if (machinesIdWithChecklists.length > 0) {
            const onlyMachinesWithChecklist = dataFormatted.filter(d =>
              machinesIdWithChecklists.includes(d.id),
            );

            setDataTable(onlyMachinesWithChecklist);
          } else {
            setDataTable(dataFormatted);
          }
        })
        .catch(() => MessageAlert(translated.error_load, 'error'))
        .finally(() => setLoading(false));
    },
    [department_id, translated, translation, to],
  );

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
              .where('departments', 'array-contains', department_id)
              .orderBy(lastFilterConsulted)
              .startAt(lastValueConsulted)
              .endAt(`${lastValueConsulted}\uf8ff`)
              .startAfter(lastDocPaginate)
              .limit(pageSize)
          : firebase
              .firestore()
              .collection('machines')
              .where('departments', 'array-contains', department_id)
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
              description:
                translation === 'en-us'
                  ? String(doc.data().description_english)
                  : String(doc.data().description),
              photos: doc.data().photos,
            };
          });

          setDataTable(dataFormatted);
        })
        .catch(() => MessageAlert(translated.error_load, 'error'))
        .finally(() => setLoading(false));
    },
    [
      firstDocPaginate,
      lastDocPaginate,
      lastFilterConsulted,
      lastValueConsulted,
      department_id,
      translated,
      translation,
    ],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchMachines({
      searchValue: '',
      filterValue: translated.filter_value_name,
    });
  }, [handleFetchMachines, translated]);

  useEffect(() => {
    handleFetchMachines({
      searchValue: '',
      filterValue: translated.filter_value_name,
    });
  }, [handleFetchMachines, translated]);

  return (
    <Container>
      <Header>
        <HighlightTitle title={translated.title} lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchMachines}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder={translated.input_search_placeholder}
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

      <SubTitleDivider title={translated.subtitle} />

      {loading ? (
        <Load />
      ) : (
        <>
          <ServiceContainer>
            {dataTable.map(machine => (
              <SimpleSelectCard
                key={machine.id}
                title={machine.description}
                link={`/${to}/${machine.id}`}
              />
            ))}
          </ServiceContainer>

          <Pagination
            showPrev={pageNumber > 1}
            handlePrev={() => handlePagination('prev')}
            showNext={existsMoreRecords}
            handleNext={() => handlePagination('next')}
          />
        </>
      )}

      <Content />
    </Container>
  );
};

export default EquipamentsSelect;
