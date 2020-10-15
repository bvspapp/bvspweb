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

  const formRef = useRef<FormHandles>(null);
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

      setLoading(true);

      if (to === 'checklistdetails') {
        await firebase
          .firestore()
          .collection('checklists')
          .get()
          .then(async snapshot => {
            snapshot.docs.forEach(doc =>
              machinesIdWithChecklists.push(doc.data().machines),
            );
          });
      }

      const valueFormatted = searchValue.toLowerCase().trim();

      await firebase
        .firestore()
        .collection('machines')
        .where('departments', 'array-contains', department_id)
        .orderBy(filterValue)
        .startAt(valueFormatted)
        .endAt(`${valueFormatted}\uf8ff`)
        .get()
        .then(snapshot => {
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
            const onlyMachinesWithChecklist = dataFormatted.filter(data =>
              machinesIdWithChecklists.includes(data.id),
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
        <ServiceContainer>
          {dataTable.map(machine => (
            <SimpleSelectCard
              key={machine.id}
              title={machine.description}
              link={`/${to}/${machine.id}`}
            />
          ))}
        </ServiceContainer>
      )}

      <Content />
    </Container>
  );
};

export default EquipamentsSelect;
