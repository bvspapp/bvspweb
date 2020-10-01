import React from 'react';
import { Document, Text, View, Page, Image } from '@react-pdf/renderer';

import logo from '../../../assets/logo.png';
import stylePdf from './stylePdf';

interface IPdfData {
  payload: {
    machine: {
      id: string;
      name: string;
      department: string;
    };
    parts: {
      id: string;
      name: string;
      oemcode: string;
      bvspcode: string;
      photo: string;
    }[];
  };
}

const ExportPdfPartsByMachine: React.FC<IPdfData> = ({ payload }) => {
  return (
    <Document>
      {/** Capa */}
      <Page
        size="A4"
        style={{ justifyContent: 'center', alignItems: 'center' }}
        wrap
      >
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image source={logo} style={{ width: 180, height: 49 }} />
        </View>
      </Page>

      <Page size="A4" style={stylePdf.page}>
        <View style={stylePdf.section} fixed>
          <View style={stylePdf.logo}>
            <Image source={logo} style={stylePdf.logoImage} />
          </View>

          <View style={stylePdf.departmentContent}>
            {payload.machine.department.split('').map((char, index) => (
              <Text key={String(index)} style={stylePdf.departmentText}>
                {char}
              </Text>
            ))}
          </View>
        </View>

        {/** Dados da Máquina */}
        <View style={stylePdf.content} key={payload.machine.id} wrap={false}>
          <Text style={stylePdf.title}>{payload.machine.name}</Text>
        </View>

        <View style={stylePdf.contentParts}>
          {
            /** Terceiro, listo as peças da máquina */
            payload.parts.map(part => (
              <View style={stylePdf.part} key={part.id} wrap={false}>
                <Image style={stylePdf.imagePart} source={part.photo} />
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
            ))
          }
        </View>
      </Page>
    </Document>
  );
};

export default ExportPdfPartsByMachine;
