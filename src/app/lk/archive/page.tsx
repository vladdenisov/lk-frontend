import { GetPaymentList } from "@/components/print/get-payment-list";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export default function ArchivePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Архив документов</h1>
      <p className="text-sm text-gray-500 mb-4">Поиск, фильтрация и скачивание ранее подписанных или обработанных документов.</p>
      <div className="mt-4">
        <GetPaymentList />  
      </div>
    </div>
  );
} 