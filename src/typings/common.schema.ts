import * as yup from 'yup';
import { Attachment } from './common';

export const attachmentSchema: yup.ObjectSchema<Attachment> = yup.object().shape({
  GUID: yup.string().required('GUID обязателен'),
  name: yup.string(),
  FileName: yup.string().required('Имя файла обязательно'),
  FileData: yup.string().required('Данные файла обязательны'),
  Signed: yup.boolean()
});

export const uniqDataSchema = yup.object().shape({
  GUID: yup.string().required('GUID обязателен'),
  name: yup.string().required('Имя обязательно'),
});



