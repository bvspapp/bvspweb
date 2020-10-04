import React from 'react';
import { useHistory } from 'react-router-dom';

import { MdArrowBack } from 'react-icons/md';
import light from '../../../styles/themes/light';
import HighlightTitle from '../../../components/HighlightTitle';

import { Container, Header, Content, BackButton, Description } from './styles';

const Institutional: React.FC = () => {
  const history = useHistory();

  return (
    <Container>
      <Header>
        <HighlightTitle title="Institucional" lineAlign="left" />
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
        <HighlightTitle title="Sobre Nós" />
        <Description>
          A BVSP é uma empresa brasileira especializada no desenvolvimento,
          fabricação e comercialização de peças de alta complexidade para a
          indústria nacional e internacional.
        </Description>
      </Content>
    </Container>
  );
};

export default Institutional;
