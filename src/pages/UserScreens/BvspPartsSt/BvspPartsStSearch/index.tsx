import React, {
  useRef,
  useCallback,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';

import { FiSearch, FiFilter, FiX, FiFile } from 'react-icons/fi';
import { MdArrowBack } from 'react-icons/md';

import firebase from '../../../../config/firebase';
import light from '../../../../styles/themes/light';
import Load from '../../../../components/Load';

import HighlightTitle from '../../../../components/HighlightTitle';
import ProductCard from '../../../../components/ProductCard';
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
  SelectFilter,
  ProductContainer,
  HeaderLeft,
  MachineName,
  HeaderRight,
  PdfButton,
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

interface IRouteParams {
  match: {
    params: {
      machine_id: string;
    };
  };
}

interface IMachineData {
  description: string;
  description_english: string;
  descriptionFormatted: string;
}

const BvspPartsStSearch: React.FC<IRouteParams> = ({ match }) => {
  const [dataTable, setDataTable] = useState<IData[]>([]);
  const [loading, setLoading] = useState(true);
  const [machine, setMachine] = useState<IMachineData>({} as IMachineData);

  const [linkFilePdf, setLinkFilePdf] = useState();

  const { machine_id } = match.params;
  const formRef = useRef<FormHandles>(null);

  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

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
      {
        value: translated.filter_value_name,
        label: translated.filter_label_name,
      },
    ];
  }, [translated]);

  const handleFetchBvspPart = useCallback(
    async (data: IDataSearch) => {
      const { searchValue, filterValue } = data;

      setLoading(true);

      const valueFormatted = searchValue.toLowerCase().trim();

      await firebase
        .firestore()
        .collection('parts')
        .where('machines', 'array-contains', machine_id)
        .orderBy(filterValue)
        .startAt(valueFormatted)
        .endAt(`${valueFormatted}\uf8ff`)
        .get()
        .then(snapshot => {
          const dataFormatted = snapshot.docs.map(doc => {
            return {
              id: String(doc.id),
              oemcode: String(doc.data().oemcode),
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
        .catch(() => MessageAlert(translated.error_load_data, 'error'))
        .finally(() => setLoading(false));
    },
    [machine_id, translation, translated],
  );

  const handleSearchClear = useCallback(() => {
    formRef.current?.setFieldValue('searchValue', '');
    formRef.current?.getFieldRef('searchValue').focus();

    handleFetchBvspPart({
      searchValue: '',
      filterValue: translated.filter_value_name,
    });
  }, [handleFetchBvspPart, translated]);

  useEffect(() => {
    handleFetchBvspPart({
      searchValue: '',
      filterValue: translated.filter_value_name,
    });
  }, [handleFetchBvspPart, translated]);

  useEffect(() => {
    firebase
      .firestore()
      .collection('machines')
      .doc(machine_id)
      .get()
      .then(snapshot => {
        const machineResponse = snapshot.data() as IMachineData;

        machineResponse.descriptionFormatted =
          translation === 'en-us'
            ? machineResponse.description_english
            : machineResponse.description;

        setMachine(machineResponse);
      })
      .catch(() => {
        MessageAlert(translated.error_load_data, 'error');
      })
      .finally(() => setLoading(false));
  }, [machine_id, translated, translation]);

  useEffect(() => {
    // obtem o link do arquivo.
    async function getLink() {
      // const translatedFolder = translation === 'pt-br' ? 'ptbr' : 'usa';

      await firebase
        .storage()
        .ref(`files/machines/ptbr/${machine_id}.pdf`)
        .getDownloadURL()
        .then(linkFile => setLinkFilePdf(linkFile));
    }

    if (machine_id) {
      getLink();
    }
  }, [machine_id]);

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <HighlightTitle title={translated.title} lineAlign="left" />
          <MachineName>{machine.descriptionFormatted}</MachineName>
        </HeaderLeft>

        <HeaderRight>
          <BackButton
            type="button"
            color={light.colors.primary}
            onClick={() => history.goBack()}
          >
            <MdArrowBack />
          </BackButton>

          {linkFilePdf && (
            <PdfButton href={linkFilePdf} target="_blank">
              <FiFile />
            </PdfButton>
          )}
        </HeaderRight>
      </Header>

      <SearchContainer ref={formRef} onSubmit={handleFetchBvspPart}>
        <SearchInput
          type="text"
          name="searchValue"
          placeholder={translated.search_input_placeholder}
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
      )}

      <Content />
    </Container>
  );
};

export default BvspPartsStSearch;
