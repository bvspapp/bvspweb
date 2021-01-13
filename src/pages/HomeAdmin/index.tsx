import React, { useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

import {
  FaCube,
  FaProjectDiagram,
  FaUser,
  FaBookmark,
  FaFolderMinus,
  FaClipboardList,
  FaElementor,
  FaStar,
  FaCloudsmith,
  FaCog,
  FaSmileWink,
  FaChartPie
} from 'react-icons/fa';

import {
  MdFeedback,
  MdPermPhoneMsg,
  MdReceipt,
  MdNotifications,
} from 'react-icons/md';

import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

import TileMenu from '../../components/TileMenu';

import { Container, TileButton } from './styles';

const HomeAdmin: React.FC = () => {
  const { user, setData } = useAuth();

  const handleGoClientPlataform = useCallback(() => {
    user.environment = 'client';
    setData({
      user
    });

  },[]);

  useEffect(() => {
    async function coutAlerts() {
      await api
        .get(`/requests/alert-count/${user.profile.id}`)
        .then(response => {
          if (response.data[0].count > 0)
            toast.error(
              '🔔 Existem solicitações pendentes para hoje. Vejo seus lembretes!',
            );
        });
    }

    coutAlerts();
  console.log(user)

  }, []);

  return (
    <Container>
      {(user.profile.name === 'gestão' || user.profile.name === 'engenharia') &&
        <>
          <TileMenu href="/bvsp-parts" title="Peças" icon={FaCog} />

          <TileMenu href="/bvsp-machines" title="Máquinas BVSP" icon={FaCube} />

          <TileMenu
            href="/other-machines"
            title="Outras Máquinas"
            icon={FaFolderMinus}
          />

          <TileMenu
            href="/special-solutions"
            title="Soluções Especiais"
            icon={FaCloudsmith}
          />
        </>
      }

      {user.profile.name === 'gestão' && (
        <>
          <TileMenu href="/users" title="Gerenciar Usuários" icon={FaUser} />
          <TileMenu href="/bvsp-services" title="Serviços" icon={FaStar} />
        </>
      )}

      { user.profile.name === 'gestão' &&
        <>
          <TileMenu
            href="/departments"
            title="Gerenciar Departamentos"
            icon={FaProjectDiagram}
          />
          <TileMenu href="/families" title="Gerenciar Famílias" icon={FaBookmark} />


          <TileMenu href="/checklists" title="Checklist" icon={FaClipboardList} />

          <TileMenu href="/portfoliopdf" title="Portfólio" icon={FaElementor} />
        </>
      }

      {(user.profile.name === 'gestão' || user.profile.name === 'atendimento' || user.profile.name === 'técnico' ) &&
        <TileMenu
          href="/attendance-register"
          title="Criar Demandas"
          icon={MdPermPhoneMsg}
        />
      }


    {(user.profile.name === 'gestão' || user.profile.name === 'qualidade') &&
    <>
      <TileMenu href="/quality" title="Qualidade" icon={MdFeedback} />
      <TileMenu
        href="/request-notifications-quality"
        title="Lembretes da Qualidade"
        icon={MdNotifications}
      />
      </>
      }

      {(user.profile.name === 'gestão' || user.profile.name === 'orçamento') &&
      <>
        <TileMenu href="/budgets" title="Orçamentos" icon={MdReceipt} />

        <TileMenu
          href="/request-notifications-budget"
          title="Lembretes do Orçamento"
          icon={MdNotifications}
        />
        </>
      }

      {user.profile.name === 'gestão' &&
        <TileMenu href="/attendance-request-indicators" title="Indicadores do Atendimento" icon={FaChartPie} />
      }


      <TileButton onClick={handleGoClientPlataform}>
        <FaSmileWink />
        Plataforma do Cliente
      </TileButton>
    </Container>
  );
};

export default HomeAdmin;
