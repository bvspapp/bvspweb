import React, { useEffect, useRef, SelectHTMLAttributes } from 'react';
import { useField } from '@unform/core';
import { IconBaseProps } from 'react-icons';

import light from '../../../styles/themes/light';

import { Container, Select, Option, Label, InputContent } from './styles';

interface ISelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  label?: string;
  icon?: React.ComponentType<IconBaseProps>;
  options: {
    value: string | number;
    label: string | number;
  }[];
  containerCustomStyle?: React.CSSProperties;
}

const SelectInput: React.FC<ISelectInputProps> = ({
  name,
  label,
  icon: Icon,
  options = [],
  containerCustomStyle,
  ...rest
}) => {
  const inputRef = useRef<HTMLSelectElement>(null);
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
        {Icon && <Icon color={light.colors.tertiary} />}
        <Select ref={inputRef} defaultValue={defaultValue} {...rest}>
          {options.map(option => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </InputContent>
    </Container>
  );
};

export default SelectInput;
