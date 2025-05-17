import { ApplicationStatus } from "@/typings/common"

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-green-100 text-green-800';
    case 'reviewing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const statusesRu: Record<ApplicationStatus, string> = {
  draft: 'Черновик',
  reviewing: 'Рассматривается',
  approved: 'Согласовано',
  rejected: 'Отклонено',
  revoked: 'Отозвано',
  uploaded: 'Обработано'
}