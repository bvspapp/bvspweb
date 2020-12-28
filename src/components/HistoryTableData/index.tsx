import React from 'react';
import { IDataTableProps } from 'react-data-table-component';

import { Container } from './styles';

const HistoryTableData: React.FC<IDataTableProps> = ({ columns, data }) => {
  return (
    <Container
      progressPending={false}
      progressComponent="carregando..."
      noHeader
      noDataComponent=""
      columns={columns}
      data={data}
      highlightOnHover
      paginationComponentOptions={{
        rowsPerPageText: 'Items por página:',
        rangeSeparatorText: 'de',
        noRowsPerPage: false,
        selectAllRowsItem: false,
        selectAllRowsItemText: 'Todos',
      }}
    />
  );
};

export default HistoryTableData;
