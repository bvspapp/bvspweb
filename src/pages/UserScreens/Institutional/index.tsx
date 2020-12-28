import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';
import light from '../../../styles/themes/light';
import HighlightTitle from '../../../components/HighlightTitle';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../hooks/translation';

import { Container, Header, Content, BackButton, Description } from './styles';

const Institutional: React.FC = () => {
  const history = useHistory();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Header>
        <HighlightTitle
          title={translated.institutional_header_title}
          lineAlign="left"
        />
        <BackButton
          type="button"
          color={light.colors.primary}
          onClick={() => history.goBack()}
        >
          <MdArrowBack />
        </BackButton>
      </Header>

      <Content>
        <iframe
          title="Video Institucional"
          src="https://www.youtube.com/embed/T3N6OLK3EP0"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <HighlightTitle title={translated.institutional_about_title} />
        <Description>{translated.institutional_about_description}</Description>
      </Content>
    </Container>
  );
};

export default Institutional;
