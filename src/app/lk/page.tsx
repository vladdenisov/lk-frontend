import { callProxy } from "@/lib/callProxy";

export default async function LKPage() {
  const data = await callProxy<any>("/resources/me", "GET");
  console.log(data);
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Личный кабинет</h1>
      <p className="mt-4">Здесь будет информация о пользователе.</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}