import React, { useEffect, useRef, InputHTMLAttributes } from 'react';
import { useField } from '@unform/core';
import { IconBaseProps } from 'react-icons';

import { Container, InputContent, InputField, Label } from './styles';
import light from '../../../styles/themes/light';

interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  icon?: React.ComponentType<IconBaseProps>;
  containerCustomStyle?: React.CSSProperties;
}

const TextInput: React.FC<IInputProps> = ({
  name,
  icon: Icon,
  label,
  containerCustomStyle,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    });
  }, [fieldName, registerField]);

  return (
    <Container style={containerCustomStyle}>
      <Label>{label}</Label>
      <InputContent>
        {Icon && <Icon size={16} color={light.colors.tertiary} />}
        <InputField ref={inputRef} defaultValue={defaultValue} {...rest} />
      </InputContent>
    </Container>
  );
};

export default TextInput;
