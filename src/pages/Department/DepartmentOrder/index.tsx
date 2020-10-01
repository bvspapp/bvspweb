import React, { useCallback, useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useHistory } from 'react-router-dom';

import { MdArrowBack, MdCheck } from 'react-icons/md';
import { FaHandPaper } from 'react-icons/fa';

import firebase from '../../../config/firebase';

import light from '../../../styles/themes/light';
import MessageAlert from '../../../utils/MessageAlert';
import Button from '../../../components/Form/Button';
import Load from '../../../components/Load';

import {
  Container,
  Header,
  Title,
  SubTitle,
  ButtonsContainer,
  DepartmentsCardContainer,
  DepartmentCard,
  DepartmentCardNumber,
  DepartmentCardTitle,
} from './styles';

interface IData {
  order: number;
  id: string;
  description: string;
}

interface IDepartmentsOrderData {
  order: number;
}

const DepartmentOrder: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState<IData[]>([]);

  const history = useHistory();

  const handleOrderChanged = useCallback(
    payload => {
      const { destination, source } = payload;

      if (!destination) {
        return;
      }

      if (
        destination.draggableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const oldDepartment = Array.from(departments);
      const [departmentMoved] = oldDepartment.splice(source.index, 1);
      oldDepartment.splice(destination.index, 0, departmentMoved);

      const newDepartment = oldDepartment.map(({ id, description }, index) => {
        return {
          order: index,
          id,
          description,
        };
      });

      setDepartments(newDepartment);
    },
    [departments],
  );

  const handleFetchDepartments = useCallback(async () => {
    const response = await firebase
      .firestore()
      .collection('departments')
      .orderBy('order')
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          return {
            id: doc.id,
            order: Number(doc.data().order),
            description: String(doc.data().description),
          };
        }),
      )
      .finally(() => setLoading(false));

    setDepartments(response);
  }, []);

  const handleBack = useCallback(() => {
    history.push('/departments');
  }, [history]);

  const handleOrdersDepartamentUpdate = useCallback(() => {
    departments.map(async department => {
      const { id, order } = department;

      const departmentOrders: IDepartmentsOrderData = { order };

      await firebase
        .firestore()
        .collection('departments')
        .doc(id)
        .update(departmentOrders);
    });

    MessageAlert('Atualizado com sucesso!', 'success').then(() =>
      history.push('/departments'),
    );
  }, [departments, history]);

  useEffect(() => {
    handleFetchDepartments();
  }, [handleFetchDepartments]);

  return loading ? (
    <Load />
  ) : (
    <Container>
      <ButtonsContainer>
        <Button type="button" color={light.colors.primary} onClick={handleBack}>
          <MdArrowBack />
          Voltar
        </Button>

        <Button
          type="button"
          color={light.colors.success}
          onClick={handleOrdersDepartamentUpdate}
        >
          <MdCheck />
          Salvar
        </Button>
      </ButtonsContainer>

      <Header>
        <Title>Organizar Ordem dos Departamentos</Title>
        <SubTitle>
          A ordem definida aqui é a que será exibida no aplicativo. Para mudar a
          ordem arraste e solte na nova posição.
          <FaHandPaper />
        </SubTitle>
      </Header>

      <DragDropContext onDragEnd={handleOrderChanged}>
        <Droppable droppableId="droppable">
          {droppableProvided => (
            <DepartmentsCardContainer
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {departments.map(({ id, order, description }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {draggableProvided => (
                    <DepartmentCard
                      key={id}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      ref={draggableProvided.innerRef}
                    >
                      <DepartmentCardNumber>{order + 1}</DepartmentCardNumber>
                      <DepartmentCardTitle>{description}</DepartmentCardTitle>
                    </DepartmentCard>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </DepartmentsCardContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default DepartmentOrder;
