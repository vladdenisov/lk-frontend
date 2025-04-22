'use client'; // Mark as client component for data fetching hooks

import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { CurrentUser } from '@/types/user';
import { Server } from '@/types/server';

// Define structure for 1C Employee data (based on user provided example)
interface Employee1C {
  GUID: string;
  name: string;
  Number: string;
  Position: { GUID: string; name: string };
  Department: { GUID: string; name: string };
  DayIn: string;
  DayOut: string;
  Organization: { name: string; GUID: string };
}

interface ProxyResponse {
  employees: Employee1C[];
}

const UserTable = ({ users, onUserSelect, selectedUserId }: { 
  users: CurrentUser[]; 
  onUserSelect: (userId: number) => void;
  selectedUserId?: number;
}) => (
  <div className="mt-4">
    <h2 className="text-xl font-semibold mb-2">Системные пользователи</h2>
    {users.length === 0 ? (
      <p>Нет пользователей.</p>
    ) : (
      <ul className="list-disc pl-5">
        {users.map(user => (
          <li 
            key={user.id} 
            className={`cursor-pointer p-1 rounded ${selectedUserId === user.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            onClick={() => onUserSelect(user.id)}
          >
            {user?.name} ({user?.email}) 
            {user?.server && <span className="ml-2 text-gray-600">Сервер: {user.server.name}</span>}
            <span className="ml-2">- GUID: {user?.GUID || 'Не назначен'}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const EmployeeTable = ({ 
  employees, 
  onEmployeeSelect, 
  selectedEmployeeGUID 
}: { 
  employees: Employee1C[];
  onEmployeeSelect: (guid: string) => void;
  selectedEmployeeGUID?: string;
}) => (
  <div className="mt-4">
    <h2 className="text-xl font-semibold mb-2">Сотрудники 1С</h2>
     {employees.length === 0 ? (
      <p>Нет сотрудников.</p>
    ) : (
      <ul className="list-disc pl-5">
        {employees.map(emp => (
          <li 
            key={emp.GUID}
            className={`cursor-pointer p-1 rounded ${selectedEmployeeGUID === emp.GUID ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            onClick={() => onEmployeeSelect(emp.GUID)}
          >
            {emp.name} ({emp.Position?.name} / {emp.Department?.name}) - GUID: {emp.GUID}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default function AdminUsersPage() {
  const [proxyUsers, setProxyUsers] = useState<CurrentUser[]>([]);
  const [employees1C, setEmployees1C] = useState<Employee1C[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number>();
  const [selectedServerId, setSelectedServerId] = useState<number>();
  const [selectedEmployeeGUID, setSelectedEmployeeGUID] = useState<string>();
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
  const [isLoadingServers, setIsLoadingServers] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      setIsLoadingServers(true);
      try {
        const servers = await apiRequest<Server[]>('servers', { method: 'GET' });
        setServers(servers || []);
      } catch (err: any) {
        console.error("Failed to fetch servers:", err);
        setError(prev => prev ? `${prev}\nFailed to load servers.` : 'Failed to load servers.');
      } finally {
        setIsLoadingServers(false);
      }
    };

    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      try {
        // TODO: Replace 'users' with the actual backend endpoint for fetching users
        const users = await apiRequest<CurrentUser[]>('users', { method: 'GET' });
        setProxyUsers(users || []);
      } catch (err: any) { 
        console.error("Failed to fetch proxy users:", err);
        setError(prev => prev ? `${prev}\nFailed to load system users.` : 'Failed to load system users.');
      } finally {
        setIsLoadingUsers(false);
      }
    };

    const fetchEmployees = async () => {
      setIsLoadingEmployees(true);
      try {
        // Use the proxy endpoint to fetch 1C employees
        const response = await apiRequest<ProxyResponse>('servers/proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mode: 'GET', // Assuming GET for fetching employees
            url: '/resources/employees', // The target 1C endpoint
          }),
        });
        setEmployees1C(response?.employees || []);
      } catch (err: any) {
        console.error("Failed to fetch 1C employees:", err);
         setError(prev => prev ? `${prev}\nFailed to load 1C employees.` : 'Failed to load 1C employees.');
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchUsers();
    fetchEmployees();
    fetchServers();
  }, []);

  const handleAssignServer = async () => {
    if (!selectedUserId || !selectedServerId) {
      setError('Пожалуйста, выберите пользователя и сервер');
      return;
    }

    try {
      await apiRequest(`servers/${selectedServerId}/users/${selectedUserId}`, {
        method: 'POST',
      });
      
      // Refresh users list to show updated assignments
      const users = await apiRequest<CurrentUser[]>('users', { method: 'GET' });
      setProxyUsers(users || []);
      
      setError(null);
    } catch (err: any) {
      console.error("Failed to assign server:", err);
      setError('Не удалось назначить сервер пользователю');
    }
  };

  const handleAssignGUID = async () => {
    if (!selectedUserId || !selectedEmployeeGUID) {
      setError('Пожалуйста, выберите пользователя и сотрудника 1С');
      return;
    }

    try {
      await apiRequest(`users/${selectedUserId}`, {
        method: 'PUT',
        body: JSON.stringify({ GUID: selectedEmployeeGUID }),
        headers: { 'Content-Type': 'application/json' },
      });
      
      // Refresh users list to show updated assignments
      const users = await apiRequest<CurrentUser[]>('users', { method: 'GET' });
      setProxyUsers(users || []);
      
      setError(null);
    } catch (err: any) {
      console.error("Failed to assign GUID:", err);
      setError('Не удалось сопоставить пользователя с сотрудником 1С');
    }
  };

  const selectedUser = proxyUsers.find(u => u.id === selectedUserId);
  const selectedEmployee = employees1C.find(e => e.GUID === selectedEmployeeGUID);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Управление пользователями и сотрудниками 1С</h1>
      <p className="mb-4">Здесь можно сопоставить системных пользователей с сотрудниками из 1С и назначить им сервер.</p>
      
      {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          {isLoadingUsers ? (
            <p>Загрузка системных пользователей...</p>
          ) : (
            <UserTable 
              users={proxyUsers} 
              onUserSelect={setSelectedUserId}
              selectedUserId={selectedUserId}
            />
          )}
        </div>
        
        <div>
          {isLoadingEmployees ? (
            <p>Загрузка сотрудников 1С...</p>
          ) : (
            <EmployeeTable 
              employees={employees1C}
              onEmployeeSelect={setSelectedEmployeeGUID}
              selectedEmployeeGUID={selectedEmployeeGUID}
            />
          )}
        </div>
      </div>

      {selectedUser && (
        <div className="mt-6 space-y-6">
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Назначение сервера</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Выберите сервер для пользователя {selectedUser.name}
                </label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={selectedServerId || ''}
                  onChange={(e) => setSelectedServerId(Number(e.target.value))}
                >
                  <option value="">Выберите сервер</option>
                  {servers.map(server => (
                    <option key={server.id} value={server.id}>
                      {server.name} ({server.baseUrl})
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleAssignServer}
                disabled={!selectedServerId}
              >
                Назначить сервер
              </button>
            </div>
          </div>

          <div className="p-4 border rounded bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">Сопоставление с сотрудником 1С</h3>
            <div className="space-y-4">
              {selectedEmployee ? (
                <div>
                  <p className="text-sm text-gray-600">
                    Выбран сотрудник: {selectedEmployee.name} ({selectedEmployee.Position?.name})
                  </p>
                  <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={handleAssignGUID}
                  >
                    Сопоставить с сотрудником
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-600">
                  Выберите сотрудника 1С из списка справа для сопоставления
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!selectedUser && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <p className="text-sm text-gray-600">
            Выберите пользователя из списка для назначения сервера и сопоставления с сотрудником 1С
          </p>
        </div>
      )}
    </div>
  );
} 