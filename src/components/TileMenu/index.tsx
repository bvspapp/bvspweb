import React from 'react';
import { IconBaseProps } from 'react-icons';

import { Container } from './styles';

interface ITileMenuProps {
  icon: React.ComponentType<IconBaseProps>;
  title: string;
  href: string;
}

const TileMenu: React.FC<ITileMenuProps> = ({ icon: Icon, title, href }) => (
  <Container href={href}>
    <Icon />
    {title}
  </Container>
);

export default TileMenu;
