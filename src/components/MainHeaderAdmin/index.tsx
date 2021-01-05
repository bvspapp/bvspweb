import React, { useCallback, useEffect, useState } from 'react';
import { FaPowerOff, FaHome } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../hooks/auth';

import logoImg from '../../assets/logo.png';
import api from '../../services/api';

import {
  Container,
  LogoImg,
  NavMenu,
  NavMenuItemLink,
  NavMenuItemButton,
  NavNotificationMenuItemButton,
  Divider,
  User,
  UserName,
} from './styles';

const MainHeaderAdmin: React.FC = () => {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const { signOut, user } = useAuth();
  const history = useHistory();

  const handleSignOut = useCallback(() => {
    signOut();
    history.push('/');
  }, [history, signOut]);

  useEffect(() => {

    if(!user.name)
    signOut();


    async function coutAlerts() {
      await api
        .get(`/requests/alert-count/${user.profile.id}`)
        .then(response => {
          setNotificationsCount(response.data[0].count);
        });
    }
    coutAlerts();
  }, [user.profile.id]);

  return (
    <Container>
      <LogoImg src={logoImg} alt="BVSP Parts" />

      <NavMenu>
        <NavMenuItemLink
          to="/"
          title="Voltar ao Início"
          style={{ marginRight: 20 }}
        >
          <FaHome />
        </NavMenuItemLink>
        {notificationsCount > 0 && (
          <NavNotificationMenuItemButton title="Notificações">
            <span>{notificationsCount}</span>
            <MdNotifications />
          </NavNotificationMenuItemButton>
        )}
        <Divider />
        <User>
          <UserName>{`Olá, ${user.name}`}</UserName>
        </User>
        <Divider />

        <NavMenuItemButton onClick={handleSignOut} title="Sair e Desconectar">
          <FaPowerOff />
        </NavMenuItemButton>
      </NavMenu>
    </Container>
  );
};

export default MainHeaderAdmin;
