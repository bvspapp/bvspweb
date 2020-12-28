import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { FaHome, FaUser, FaPhoneAlt, FaMailBulk } from 'react-icons/fa';
import { TiWorld } from 'react-icons/ti';
import { GiExitDoor } from 'react-icons/gi';

import logoImg from '../../assets/logo.png';

import { useAuth } from '../../hooks/auth';

import { useTranslation } from '../../hooks/translation';
import translatedContent from './translatedcontent';

import {
  Container,
  LogoContainer,
  Logo,
  MenuContainer,
  Menu,
  Logout,
} from './styles';

const FloatMenuUser: React.FC = () => {
  const { signOut } = useAuth();
  const history = useHistory();

  const { translation } = useTranslation();

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const handleSignOut = useCallback(() => {
    signOut();
    history.push('/');
  }, [history, signOut]);

  return (
    <Container>
      <LogoContainer>
        <Logo src={logoImg} alt="Logo" />
      </LogoContainer>

      <MenuContainer>
        <Menu to="/">
          <FaHome />
          {translated.menubar_button_home}
        </Menu>

        <Menu to="/institutional">
          <TiWorld />
          {translated.menubar_button_institutional}
        </Menu>

        <Menu to="/profile">
          <FaUser />
          {translated.menubar_button_profile}
        </Menu>

        <Menu to="/attendance">
          <FaMailBulk />
          {translated.menubar_button_attendance}
        </Menu>

        <Menu to="/contact">
          <FaPhoneAlt />
          {translated.menubar_button_contact}
        </Menu>
      </MenuContainer>

      <Logout type="button" onClick={handleSignOut} title="Sair e Desconectar">
        <GiExitDoor />
        {translated.menubar_button_logout}
      </Logout>
    </Container>
  );
};

export default FloatMenuUser;
