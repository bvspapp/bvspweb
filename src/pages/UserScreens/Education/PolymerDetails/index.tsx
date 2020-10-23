import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';

import light from '../../../../styles/themes/light';

import HighlightTitle from '../../../../components/HighlightTitle';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

import {
  Container,
  Header,
  Content,
  BackButton,
  CardTitle,
  CardsContainer,
  CardDescription,
} from './styles';

interface IRouteParams {
  match: {
    params: {
      type: string;
    };
  };
}

interface IData {
  [key: string]: {
    title: string;
    items: string[];
  }[];
}

const PolymerDetails: React.FC<IRouteParams> = ({ match }) => {
  const history = useHistory();
  const { translation } = useTranslation();

  const { type } = match.params;

  const translated = useMemo(() => {
    const data: IData =
      translation === 'en-us'
        ? translatedContent.en_US
        : translatedContent.pt_BR;

    return data[type];
  }, [translation, type]);

  return (
    <Container>
      <Header>
        <HighlightTitle title={type} lineAlign="left" />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      {translated.map(item => (
        <Content key={item.title}>
          <CardTitle>{item.title}</CardTitle>
          <CardsContainer>
            {item.items.map(subitem => (
              <CardDescription key={subitem}>{subitem}</CardDescription>
            ))}
          </CardsContainer>
        </Content>
      ))}
    </Container>
  );
};

export default PolymerDetails;
