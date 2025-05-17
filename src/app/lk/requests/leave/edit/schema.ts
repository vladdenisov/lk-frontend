import { ApplicationStatus } from '@/typings/common';
import { attachmentSchema, uniqDataSchema } from '@/typings/common.schema';
import { VacationRequestCreate } from '@/typings/vacation';
import * as yup from 'yup';

export const leaveRequestSchema: yup.ObjectSchema<VacationRequestCreate> = yup.object().shape({
  DateStart: yup.string().required('Дата начала обязательна'),
  DateEnd: yup.string().required('Дата окончания обязательна'),
  Comment: yup.string().required('Комментарий обязателен'),
  VacationType: yup.string().required('Тип отпуска обязателен'),
  DaysCount: yup.number().required('Количество дней обязательно'),
  Employee: yup.string().required('Сотрудник обязателен'),
  Attachments: yup.array().of(attachmentSchema),
  Status: yup.mixed<ApplicationStatus>().required('Статус обязателен')
});

