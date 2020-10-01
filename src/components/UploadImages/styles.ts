import styled from 'styled-components';

interface IDropContainerProps {
  isDragActive: boolean;
  isDragReject: boolean;
}

interface IUploadMessageProps {
  type: 'default' | 'error' | 'success';
}

const messageColors = {
  default: '#999',
  error: '#e57878',
  success: '#0275D8 ',
};

export const Container = styled.div`
  background: ${props => props.theme.colors.white};
  border-radius: 5px;

  padding: 20px;
`;

export const DropContainer = styled.div<IDropContainerProps>`
  border: 1px dashed #ddd;
  border-radius: 5px;
  cursor: pointer;
  transition: height 0.2s ease;

  ${props => props.isDragActive && props.theme.colors.success}};
  ${props => props.isDragReject && props.theme.colors.warning};
`;

export const UploadMessage = styled.div<IUploadMessageProps>`
  display: flex;
  justify-content: center;
  align-items: center;

  color: ${props => messageColors[props.type]};

  padding: 20px 0;
  font-size: 14px;
`;
