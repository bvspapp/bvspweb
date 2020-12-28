import React, { useMemo, useCallback, useState, useRef } from 'react';
import * as Yup from 'yup';
import { useHistory } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { uniqueId } from 'lodash';
import filesize from 'filesize';
import { useAuth } from '../../../../hooks/auth';

import light from '../../../../styles/themes/light';
import HighlightTitle from '../../../../components/HighlightTitle';
import MessageAlert from '../../../../utils/MessageAlert';
import TextInput from '../../../../components/Form/TextInput';
import TextAreaInput from '../../../../components/Form/TextAreaInput';
import UploadImages from '../../../../components/UploadImages';
import ImageController from '../../../../components/ImageController';
import clerkmg from '../../../../assets/clerk.svg';
import Toggle from '../../../../components/Toggle';

import api from '../../../../services/api';
import firebase from '../../../../config/firebase';

import {
  Container,
  Content,
  Form,
  ButtonRegister,
  FormContent,
  ContactIllustration,
  TextWait,
  UploadImagesLabel,
  ImagesContainer,
  ToggleContainer,
} from './styles';

import translatedContent from './translatedcontent';
import { useTranslation } from '../../../../hooks/translation';

interface IRouteParams {
  match: {
    params: {
      contact: 'call' | 'mail' | 'whatsapp';
      type: number;
    };
  };
}

interface IFormData {
  contact: string;
  description: string;
  contact_type_id: number;
}

interface IImageStoraged {
  url: string;
  name: string;
}

interface IImageFile {
  file: File;
  id: string;
  name: string;
  readableSize: string;
  preview: string;
  url: string | null;
}

const AttendanceRegister: React.FC<IRouteParams> = ({ match }) => {
  const { user } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<IImageFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachmentAdd, setAttachmentAdd] = useState(false);
  const { translation } = useTranslation();
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();

  const { type, contact } = match.params;

  const translated = useMemo(() => {
    return translation === 'en-us'
      ? translatedContent.en_US
      : translatedContent.pt_BR;
  }, [translation]);

  const formTitle = useMemo(() => {
    if (contact === 'call') return translated.title_call;
    if (contact === 'mail') return translated.title_mail;
    if (contact === 'whatsapp') return translated.title_whatsapp;

    return '';
  }, [
    translated.title_call,
    translated.title_mail,
    translated.title_whatsapp,
    contact,
  ]);

  const initialData = useMemo(() => {
    if (contact === 'mail')
      return { contact: user.email, about: '', contact_type_id: 1 };

    if (contact === 'whatsapp')
      return { contact: user.telephone, about: '', contact_type_id: 3 };

    return { contact: user.telephone, about: '', contact_type_id: 2 };
  }, [contact, user.email, user.telephone]);

  const handleGetUrlUploadImages = useCallback(async (images: IImageFile[]) => {
    if (images.length === 0) return [] as IImageStoraged[];

    const urlList: IImageStoraged[] = [];

    await Promise.all(
      images.map(async photo => {
        await firebase
          .storage()
          .ref(`images/${photo.name}`)
          .put(photo.file)
          .then(async snapshot => {
            await snapshot.ref
              .getDownloadURL()
              .then(downloadURL =>
                urlList.push({ url: downloadURL, name: photo.name }),
              );
          });
      }),
    );

    return urlList;
  }, []);

  const handleSubmit = useCallback(
    async (data: IFormData) => {
      try {
        setLoading(true);

        const schema = Yup.object().shape({
          contact: Yup.string().required(translated.error_notfound_contact),
          description: Yup.string().required(translated.error_notfound_about),
        });

        await schema.validate(data);

        await api
          .post('requests', {
            user_id: user.id,
            contact_type_id: initialData.contact_type_id,
            description: data.description,
            contact: data.contact,
            request_type: type,
          })
          .then(async response => {
            if (attachmentAdd) {
              const imagesURL = await handleGetUrlUploadImages(uploadedImages);

              await firebase.firestore().collection('attachment').add({
                request_id: response.data.id,
                photos: imagesURL,
              });
            }
          });

        MessageAlert(translated.success_register, 'success').then(() => {
          history.push('/myrequests');
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          MessageAlert(error.errors[0], 'info');
        } else {
          MessageAlert(translated.error_register, 'info');
        }
      } finally {
        setLoading(false);
      }
    },
    [
      history,
      type,
      translated.error_notfound_about,
      translated.error_notfound_contact,
      translated.error_register,
      translated.success_register,
      initialData.contact_type_id,
      user.id,
      handleGetUrlUploadImages,
      uploadedImages,
      attachmentAdd,
    ],
  );

  const handleImagesUpload = useCallback(
    imageFiles => {
      if (uploadedImages.length === 2)
        return MessageAlert('Você pode adicionar somente 2 imagens');

      const uploadeds = imageFiles.map((file: File) => ({
        file,
        id: uniqueId(),
        name: `${Date.parse(String(new Date()))}-${file.name}`,
        readableSize: filesize(file.size),
        preview: URL.createObjectURL(file),
        url: null,
      }));

      setUploadedImages(uploadedImages.concat(uploadeds));
    },
    [uploadedImages],
  );

  const handleRemoveImageUploaded = useCallback(
    (imageId: string) => {
      setUploadedImages(uploadedImages.filter(image => image.id !== imageId));
    },
    [uploadedImages],
  );

  return (
    <Container>
      <Content>
        <HighlightTitle title={formTitle} />

        {loading ? (
          <TextWait>{translated.text_wait}</TextWait>
        ) : (
          <Form ref={formRef} initialData={initialData} onSubmit={handleSubmit}>
            <FormContent disabled={false}>
              <TextInput
                type="text"
                name="contact"
                label={translated.label_contact_info}
                required
                placeholder={translated.phonenumber_placeholder}
              />

              <TextAreaInput
                name="description"
                label={translated.label_about}
                rows={5}
              />

              <ToggleContainer>
                <Toggle
                  labelLeft="Sem Anexo"
                  labelRight="Incluir Anexo"
                  checked={attachmentAdd}
                  onChange={() => setAttachmentAdd(!attachmentAdd)}
                />
              </ToggleContainer>

              {attachmentAdd && (
                <>
                  <UploadImagesLabel>
                    {translated.label_load_images}
                  </UploadImagesLabel>
                  <UploadImages onUpload={handleImagesUpload} />

                  <ImagesContainer>
                    {uploadedImages.map(image => (
                      <ImageController
                        key={image.id}
                        url={image.preview}
                        containerCustomStyle={{ marginRight: 10 }}
                        handleRemoveImage={() =>
                          handleRemoveImageUploaded(image.id)
                        }
                        handleSetImageCover={() => {}}
                      />
                    ))}
                  </ImagesContainer>
                </>
              )}

              <ButtonRegister type="submit" color={light.colors.primary}>
                {translated.button_label_register}
              </ButtonRegister>
            </FormContent>
          </Form>
        )}

        <ContactIllustration src={clerkmg} />
      </Content>
    </Container>
  );
};

export default AttendanceRegister;
