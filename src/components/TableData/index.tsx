import React, { useMemo } from 'react';
import { IconBaseProps } from 'react-icons';
import { IDataTableProps } from 'react-data-table-component';

import { Container, ControllerContainer, Controller } from './styles';

interface ITableDataProps extends IDataTableProps {
  controllers?: {
    route: string;
    action: string;
    icon: React.ComponentType<IconBaseProps>;
  }[];
}

interface IRowProps {
  id: string;
}

const TableData: React.FC<ITableDataProps> = ({
  columns,
  data,
  controllers = [],
  pagination,
}) => {
  const columnsFormated = useMemo(() => {
    if (controllers.length > 0) {
      return [
        ...columns,
        {
          name: '',
          right: true,
          cell: ({ id }: IRowProps) => (
            <ControllerContainer>
              {controllers.map(({ route, action, icon: Icon }, index) => (
                <Controller
                  key={String(index)}
                  href={`${route}/${action}/${id}`}
                >
                  <Icon />
                </Controller>
              ))}
            </ControllerContainer>
          ),
        },
      ];
    }
    return columns;
  }, [columns, controllers]);

  return (
    <Container
      progressPending={false}
      progressComponent="carregando..."
      noHeader
      noDataComponent=""
      columns={columnsFormated}
      data={data}
      highlightOnHover
      pagination={pagination}
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

export default TableData;
