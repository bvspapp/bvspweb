import React, { useEffect, useRef, TextareaHTMLAttributes } from 'react';
import { useField } from '@unform/core';

import { Container, InputContent, InputField, Label } from './styles';

interface IInputProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  containerCustomStyle?: React.CSSProperties;
}

const TextAreaInput: React.FC<IInputProps> = ({
  name,
  label,
  containerCustomStyle,
  ...rest
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
        <InputField ref={inputRef} defaultValue={defaultValue} {...rest} />
      </InputContent>
    </Container>
  );
};

export default TextAreaInput;
