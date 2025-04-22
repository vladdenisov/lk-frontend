import { useState, useEffect } from 'react';
import { LeaveType, VacationDaysResponse } from '@/types/leave';
import { format } from 'date-fns';
import { callProxy } from '@/lib/callProxy';

export const useLeaveRequest = () => {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string>('');
  const [vacationDaysInfo, setVacationDaysInfo] = useState<VacationDaysResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        setIsLoading(true);
        const response = await callProxy<{
          data: LeaveType[]}>('/leave/types', 'GET');
        setLeaveTypes(response.data);
        // Set default leave type to the primary one if available
        const primaryType = response.data.find((type: LeaveType) => type.isPrimary);
        if (primaryType) {
          setSelectedLeaveType(primaryType.GUID);
        }
      } catch (err) {
        setError('Failed to fetch leave types');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaveTypes();
  }, []);

  const calculateVacationDays = async (startDate: Date | undefined, endDate: Date | undefined) => {
    if (!startDate || !endDate || !selectedLeaveType) return;

    try {
      setIsLoading(true);
      const response = await callProxy<VacationDaysResponse>('/resources/vacationDays/', 'POST', {
        DateStart: format(startDate, 'yyyy-MM-dd'),
        DateEnd: format(endDate, 'yyyy-MM-dd'),
        VacationType: selectedLeaveType,
      });
      setVacationDaysInfo(response);
    } catch (err) {
      setError('Failed to calculate vacation days');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    leaveTypes,
    selectedLeaveType,
    setSelectedLeaveType,
    vacationDaysInfo,
    calculateVacationDays,
    isLoading,
    error,
  };
}; 