import * as yup from 'yup';

export const attachmentSchema = yup.object().shape({
  FileName: yup.string().required('Имя файла обязательно'),
  FileData: yup.string().required('Данные файла обязательны'),
  Signed: yup.boolean()
});

