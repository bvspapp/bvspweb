import React, { useMemo } from 'react';

import { useAuth } from '../../../../hooks/auth';

import HighlightTitle from '../../../../components/HighlightTitle';
import HighlightMenuCard from '../../../../components/HighlightMenuCard';

import ImgCalc from '../../../../assets/calc.png';
import ImgTolerance from '../../../../assets/tolerance.png';
import ImgPaper from '../../../../assets/paper.png';
import ImgTable from '../../../../assets/table.png';
import ImgScient from '../../../../assets/scient.png';
import ImgStudent from '../../../../assets/student.png';

import {
  Container,
  Header,
  UserContainer,
  UserInfo,
  User,
  Welcome,
  UserName,
  Message,
  Content,
  MenuContainer,
  Row,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

const BvspToolsList: React.FC = () => {
  const { user } = useAuth();
  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  return (
    <Container>
      <Header>
        <UserContainer>
          <UserInfo>
            <User>
              <Welcome>{translated.greet}</Welcome>
              <UserName>{user.name}</UserName>
            </User>
            <Message>{translated.welcome}</Message>
          </UserInfo>
        </UserContainer>
      </Header>

      <Content>
        <HighlightTitle
          title={translated.title}
          subtitle={translated.subtitle}
        />

        <MenuContainer>
          <Row>
            <HighlightMenuCard
              link="/hardnessconverter"
              image={ImgCalc}
              title={translated.menu_hardness_converter_label}
            />

            <HighlightMenuCard
              link="/toleranceconverter"
              image={ImgTolerance}
              title={translated.menu_fitting_tolerance_label}
            />

            <HighlightMenuCard
              link="/unitconverter"
              image={ImgPaper}
              title={translated.menu_unitconverter_label}
            />
          </Row>

          <Row>
            <HighlightMenuCard
              link="/threadedholecalculator"
              image={ImgTable}
              title={translated.menu_threaded_hole_calculator}
            />

            <HighlightMenuCard
              link="/stainlesssteels"
              image={ImgScient}
              title={translated.menu_steel_classification_label}
            />

            <HighlightMenuCard
              link="/polymers"
              image={ImgStudent}
              title={translated.menu_polymers_label}
            />
          </Row>
        </MenuContainer>
      </Content>
    </Container>
  );
};

export default BvspToolsList;
