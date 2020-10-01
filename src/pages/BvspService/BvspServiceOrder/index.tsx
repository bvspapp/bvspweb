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
  BvspServicesCardContainer,
  BvspServiceCard,
  BvspServiceCardNumber,
  BvspServiceCardTitle,
} from './styles';

interface IData {
  order: number;
  id: string;
  description: string;
}

interface IBvspServicesOrderData {
  order: number;
}

const BvspServiceOrder: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [bvspServices, setBvspServices] = useState<IData[]>([]);

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

      const oldBvspService = Array.from(bvspServices);
      const [bvspServiceMoved] = oldBvspService.splice(source.index, 1);
      oldBvspService.splice(destination.index, 0, bvspServiceMoved);

      const newBvspService = oldBvspService.map(
        ({ id, description }, index) => {
          return {
            order: index,
            id,
            description,
          };
        },
      );

      setBvspServices(newBvspService);
    },
    [bvspServices],
  );

  const handleFetchBvspServices = useCallback(async () => {
    const response = await firebase
      .firestore()
      .collection('services')
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

    setBvspServices(response);
    setLoading(false);
  }, []);

  const handleBack = useCallback(() => {
    history.push('/bvsp-services');
  }, [history]);

  const handleOrdersBvspServicesUpdate = useCallback(() => {
    bvspServices.map(async service => {
      const { id, order } = service;

      const bvspServicesOrders: IBvspServicesOrderData = { order };

      await firebase
        .firestore()
        .collection('services')
        .doc(id)
        .update(bvspServicesOrders);
    });

    MessageAlert('Atualizado com sucesso!', 'success').then(() =>
      history.push('/bvsp-services'),
    );
  }, [bvspServices, history]);

  useEffect(() => {
    handleFetchBvspServices();
  }, [handleFetchBvspServices]);

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
          onClick={handleOrdersBvspServicesUpdate}
        >
          <MdCheck />
          Salvar
        </Button>
      </ButtonsContainer>

      <Header>
        <Title>Organizar Ordem dos Serviços</Title>
        <SubTitle>
          A ordem definida aqui é a que será exibida no aplicativo. Para mudar a
          ordem arraste e solte na nova posição.
          <FaHandPaper />
        </SubTitle>
      </Header>

      <DragDropContext onDragEnd={handleOrderChanged}>
        <Droppable droppableId="droppable">
          {droppableProvided => (
            <BvspServicesCardContainer
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
            >
              {bvspServices.map(({ id, order, description }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {draggableProvided => (
                    <BvspServiceCard
                      key={id}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                      ref={draggableProvided.innerRef}
                    >
                      <BvspServiceCardNumber>{order + 1}</BvspServiceCardNumber>
                      <BvspServiceCardTitle>{description}</BvspServiceCardTitle>
                    </BvspServiceCard>
                  )}
                </Draggable>
              ))}
              {droppableProvided.placeholder}
            </BvspServicesCardContainer>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default BvspServiceOrder;
