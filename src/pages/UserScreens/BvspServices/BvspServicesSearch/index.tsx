import React, {
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiSearch, FiX } from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';
import SimpleSelectCard from '../../../../components/SimpleSelectCard';
import Load from '../../../../components/Load';
import MessageAlert from '../../../../utils/MessageAlert';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

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
} from './styles';

interface IData {
  id: string;
  description: string;
}

interface IDataSearch {
  searchValue: string;
}

const BvspServicesSearch: React.FC = () => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleFetchBvspService = useCallback(
    async (data: IDataSearch) => {
      setLoading(true);

      const { searchValue } = data;
      const valueFormatted = searchValue.toLowerCase().trim();

      if (valueFormatted) {
        await firebase
          .firestore()
          .collection('services')
          .orderBy(translated.filter_value_description)
          .startAt(valueFormatted)
          .endAt(`${valueFormatted}\uf8ff`)
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

            setDataTable(dataFormatted);
          })
          .catch(() => MessageAlert(translated.error_load_data, 'error'))
          .finally(() => setLoading(false));
      } else {
        await firebase
          .firestore()
          .collection('services')
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

            setDataTable(dataFormatted);
          })
          .catch(() => MessageAlert(translated.error_load_data, 'error'))
          .finally(() => setLoading(false));
      }
    },
    [translated, translation],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchBvspService({
      searchValue: '',
    });
  }, [handleFetchBvspService]);

  useEffect(() => {
    handleFetchBvspService({
      searchValue: '',
    });
  }, [handleFetchBvspService]);

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

      <SearchContainer ref={formRef} onSubmit={handleFetchBvspService}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder={translated.input_search_placeholder}
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
        <ServiceContainer>
          {dataTable.map(service => (
            <SimpleSelectCard
              key={service.id}
              title={service.description}
              link={`bvspservice/${service.id}`}
            />
          ))}
        </ServiceContainer>
      )}

      <Content />
    </Container>
  );
};

export default BvspServicesSearch;
