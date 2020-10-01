import styled from 'styled-components';

/**
 * Layout Application when User is Logged.
 * MH = Main Header
 * CT = Content
 */

export const Grid = styled.div`
  display: grid;

  grid-template-columns: auto;
  grid-template-rows: 60px auto;

  grid-template-areas:
    'MH'
    'CT';

  height: 100vh;
`;

export const Content = styled.main`
  grid-area: CT;

  padding: 20px;
  height: calc(100vh - 60px);

  overflow-y: scroll;
`;
