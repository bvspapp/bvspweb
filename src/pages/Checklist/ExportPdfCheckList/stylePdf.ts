import { StyleSheet } from '@react-pdf/renderer';

const styleCustom = StyleSheet.create({
  page: { padding: 30 },
  header: { alignItems: 'center' },
  logo: { width: 120, height: 29, marginTop: 20 },
  headerTitle: { fontSize: 18, marginVertical: 20, fontWeight: 'bold' },
  checklistHeader: { width: '100%' },
  checklistLabel: { fontWeight: 'bold', color: '#909090', fontSize: 10 },
  checklistTitle: { fontSize: 14, fontWeight: 700, marginTop: 5 },
  HorizontalLine: {
    width: '100%',
    height: 0.5,
    backgroundColor: '#000',
    marginVertical: 20,
  },
  stepsContainer: {
    width: '100%',
    flexDirection: 'column',
    paddingVertical: 5,
  },
  stepContent: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#dedcdc',
    alignItems: 'center',
    borderRadius: 5,
  },
  stepNumberContainer: {
    height: '100%',
    minWidth: 30,
    backgroundColor: '#D92332',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextNumber: { fontSize: 14, color: '#FFF' },
  stepTextDescription: {
    width: '100%',
    textAlign: 'justify',
    fontSize: 12,
    padding: 10,
    flexWrap: 'wrap',
  },
  photosContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  photo: {
    height: 140,
    width: 130,
    marginHorizontal: 5,
  },
});

export default styleCustom;
