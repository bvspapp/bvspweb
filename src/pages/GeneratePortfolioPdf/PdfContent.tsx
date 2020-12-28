import React from 'react';
import { Document, Text, View, Page, Image } from '@react-pdf/renderer';

import logo from '../../assets/logo.png';
import stylePdf from './stylePdf';

interface IPart {
  id: string;
  name: string;
  oemcode: string;
  bvspcode: string;
  photo: string;
}

interface IMachine {
  id: string;
  name: string;
  parts: IPart[];
}

interface IPayload {
  payload: {
    departments: {
      id: string;
      name: string;
      machines: IMachine[];
    }[];
  };
}

const GeneratePortfolioPdf: React.FC<IPayload> = ({ payload }) => {
  return (
    <Document>
      {/** Capa */}
      <Page size="A4" style={stylePdf.cover} wrap>
        <View style={stylePdf.header}>
          <Image source={logo} style={stylePdf.logoImage} />
        </View>
      </Page>

      {payload.departments.map(department => (
        <Page key={department.id} size="A4" style={stylePdf.page} wrap>
          <View style={stylePdf.section} fixed>
            <View style={stylePdf.logo}>
              <Image source={logo} style={stylePdf.logoImage} />
            </View>

            <View style={stylePdf.departmentContent}>
              {department.name.split('').map((char, index) => (
                <Text key={String(index)} style={stylePdf.departmentText}>
                  {char}
                </Text>
              ))}
            </View>
          </View>

          {department.machines.map(machine => (
            <View key={machine.id}>
              <View style={stylePdf.content} wrap={false}>
                <Text style={stylePdf.title}>{machine.name}</Text>
              </View>

              <View style={stylePdf.contentParts}>
                {machine.parts.map(part => (
                  <View key={part.id} style={stylePdf.part} wrap={false}>
                    <Image
                      allowDangerousPaths
                      debug={false}
                      style={stylePdf.imagePart}
                      source={part.photo}
                    />
                    <Text style={stylePdf.namePart}>{part.name}</Text>
                    <Text style={stylePdf.codesPart}>
                      BVSP:
                      {part.bvspcode}
                    </Text>
                    <Text style={stylePdf.codesPart}>
                      OEM:
                      {part.oemcode}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};

export default GeneratePortfolioPdf;
