import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiSearch, FiX, FiFilter } from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../config/firebase';
import light from '../../../styles/themes/light';

import HighlightTitle from '../../../components/HighlightTitle';
import SimpleSelectCard from '../../../components/SimpleSelectCard';
import SubTitleDivider from '../../../components/SubTitleDivider';
import MessageAlert from '../../../utils/MessageAlert';
import Load from '../../../components/Load';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

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
  HeaderLeft,
} from './styles';

interface IData {
  id: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
  filterValue: string;
}

interface IRouteParams {
  match: {
    params: {
      to: string;
    };
  };
}

const DepartmentsSelect: React.FC<IRouteParams> = ({ match }) => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);

  const { to } = match.params;

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleSearchPartByCode = useCallback(
    async (data: IDataSearch) => {
      setLoading(true);

      const { searchValue, filterValue } = data;
      const valueFormatted = searchValue.toLowerCase().trim();

      await firebase
        .firestore()
        .collection('parts')
        .where(filterValue, '==', valueFormatted)
        .get()
        .then(snapshot => {
          history.push(`/part/${snapshot.docs[0].id}`);
        })
        .catch(() => {
          MessageAlert(translated.error_not_found, 'info');
          setLoading(false);
        });
    },
    [history, translated],
  );

  const optionsSearchFilterBvspPart = useMemo(() => {
    return [
      {
        value: 'oemcode',
        label: translated.filter_label_oemcode,
      },
      {
        value: 'bvspcode',
        label: translated.filter_label_bvspcode,
      },
    ];
  }, [translated]);

  const handleFetchDepartments = useCallback(async () => {
    try {
      // Se a próxima tela for para mostrar checklist. Então, vamos mostrar aqui somente os departamentos que tem checklist.
      if (to === 'checklistdetails') {
        const machinesIdWithChecklists = await firebase
          .firestore()
          .collection('checklists')
          .get()
          .then(async snapshot => {
            return snapshot.docs.map(doc => String(doc.data().machines));
          });

        const departmentsIdChecklists: string[] = [];

        await firebase
          .firestore()
          .collection('machines')
          .get()
          .then(async snapshot => {
            snapshot.docs.forEach(doc => {
              if (machinesIdWithChecklists.includes(doc.id)) {
                departmentsIdChecklists.push(...doc.data().departments);
              }
            });
          });

        const departmentsFormatted = await firebase
          .firestore()
          .collection('departments')
          .orderBy('order')
          .get()
          .then(snapshot => {
            const dataFormatted = snapshot.docs.map(doc => {
              return {
                id: String(doc.id),
                description:
                  translation === 'en-us'
                    ? String(doc.data().description_english)
                    : String(doc.data().description),
              };
            });

            return dataFormatted;
          });

        const departmentsFiltered = departmentsFormatted.filter(dep =>
          departmentsIdChecklists.includes(dep.id),
        );

        setDataTable(departmentsFiltered);
      } else {
        const departmentsFormatted = await firebase
          .firestore()
          .collection('departments')
          .orderBy('order')
          .get()
          .then(snapshot => {
            const dataFormatted = snapshot.docs.map(doc => {
              return {
                id: String(doc.id),
                description:
                  translation === 'en-us'
                    ? String(doc.data().description_english)
                    : String(doc.data().description),
              };
            });

            return dataFormatted;
          });

        setDataTable(departmentsFormatted);
      }
    } catch {
      MessageAlert(translated.erro_load, 'error');
    } finally {
      setLoading(false);
    }
  }, [translated.erro_load, translation, to]);

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();
  }, []);

  useEffect(() => {
    handleFetchDepartments();
  }, [handleFetchDepartments]);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HighlightTitle title={translated.title} lineAlign="left" />
        </HeaderLeft>
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      {to !== 'checklistdetails' && (
        <SearchContainer ref={formRef} onSubmit={handleSearchPartByCode}>
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
      )}

      <SubTitleDivider title={translated.label_choise_department} />

      {loading ? (
        <Load />
      ) : (
        <ServiceContainer>
          {dataTable.map(department => (
            <SimpleSelectCard
              key={department.id}
              title={department.description}
              link={`/equipaments/${department.id}/${to}`}
            />
          ))}
        </ServiceContainer>
      )}

      <Content />
    </Container>
  );
};

export default DepartmentsSelect;
