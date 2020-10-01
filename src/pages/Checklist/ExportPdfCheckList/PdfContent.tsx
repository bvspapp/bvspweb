import React from 'react';
import { Document, Text, View, Page, Image } from '@react-pdf/renderer';

import stylePdf from './stylePdf';
import logo from '../../../assets/logo.png';

interface IPhoto {
  name: string;
  step: number;
  url: string;
}

interface IPdfData {
  checklistLabel: string;
  id: string;
  name: string;
  photos: IPhoto[];
  steps: {
    description: string;
    order: number;
  }[];
}

interface IPayload {
  payload: IPdfData;
}

const PdfContent: React.FC<IPayload> = ({ payload }) => {
  return (
    <Document>
      <Page size="A4" style={stylePdf.page} wrap>
        <View style={stylePdf.header}>
          <Image src={logo} style={stylePdf.logo} />
          <Text style={stylePdf.headerTitle}>Checklist</Text>
        </View>

        <View style={stylePdf.checklistHeader}>
          <Text style={stylePdf.checklistLabel}>{payload.checklistLabel}</Text>
          <Text style={stylePdf.checklistTitle}>{payload.name}</Text>
        </View>

        <View style={stylePdf.HorizontalLine} />

        {payload.steps.map(step => (
          <View style={stylePdf.stepsContainer} wrap={false}>
            <View style={stylePdf.stepContent}>
              <View style={stylePdf.stepNumberContainer}>
                <Text style={stylePdf.stepTextNumber}>{step.order + 1}</Text>
              </View>
              <Text style={stylePdf.stepTextDescription}>
                {step.description}
              </Text>
            </View>

            {payload.photos && (
              <View style={stylePdf.photosContainer}>
                {payload.photos.map(
                  photo =>
                    photo.step === step.order && (
                      <Image style={stylePdf.photo} source={photo.url} />
                    ),
                )}
              </View>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );
};

export default PdfContent;
