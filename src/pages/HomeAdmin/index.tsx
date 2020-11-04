import React from 'react';

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
} from 'react-icons/fa';

import { useAuth } from '../../hooks/auth';

import TileMenu from '../../components/TileMenu';

import { Container } from './styles';

const HomeAdmin: React.FC = () => {
  const { user } = useAuth();

  return (
    <Container>
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

      {user.profile_type === 'admin' && (
        <TileMenu href="/users" title="Gerenciar Usuários" icon={FaUser} />
      )}

      <TileMenu
        href="/departments"
        title="Gerenciar Departamentos"
        icon={FaProjectDiagram}
      />
      <TileMenu href="/families" title="Gerenciar Famílias" icon={FaBookmark} />

      <TileMenu href="/bvsp-services" title="Serviços" icon={FaStar} />
      <TileMenu href="/checklists" title="Checklist" icon={FaClipboardList} />

      <TileMenu href="/portfoliopdf" title="Portfólio" icon={FaElementor} />
    </Container>
  );
};

export default HomeAdmin;
