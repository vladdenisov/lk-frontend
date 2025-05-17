'use client'
import { Dialog, DialogTitle } from "../ui/dialog";
import { DialogContent, DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { callProxy } from "@/lib/callProxy";
import { downloadPDF, PDFDialog } from "./pdf-dialog";
export const GetPaymentList = () => {
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getPDF = async () => {
    setLoading(true);
    const pdf = await callProxy<{pdf: string}>(`/payments/my`, 'POST', {
      Month: new Date(year, month - 1, 15).toISOString(),
    });
    console.log(pdf);
    setUrl(pdf.pdf);
    setLoading(false);
  };

  
  const handleGetPaymentList = () => {
    getPDF();
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Получить расчетный лист
        </Button>
      </DialogTrigger>
      {url && (
        <PDFDialog isLoading={loading} fileData={url} isSigningAvailable={false} />
      )}
      {!url && (
        <DialogContent>
          <DialogTitle>
            <h1>Получить расчетный лист</h1>
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <p>Выберите месяц и год для получения расчетного листа</p>
          <div className="flex flex-col gap-2">
            <Label>Месяц</Label>
            <Select onValueChange={(value) => setMonth(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите месяц" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Январь</SelectItem>
                <SelectItem value="2">Февраль</SelectItem>
                <SelectItem value="3">Март</SelectItem>
                <SelectItem value="4">Апрель</SelectItem>
                <SelectItem value="5">Май</SelectItem>
                <SelectItem value="6">Июнь</SelectItem>
                <SelectItem value="7">Июль</SelectItem>
                <SelectItem value="8">Август</SelectItem>
                <SelectItem value="9">Сентябрь</SelectItem>
                <SelectItem value="10">Октябрь</SelectItem>
                <SelectItem value="11">Ноябрь</SelectItem>
                <SelectItem value="12">Декабрь</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Год</Label>
            <Select onValueChange={(value) => setYear(parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите год" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
                <SelectItem value="2019">2019</SelectItem>
                <SelectItem value="2018">2018</SelectItem>
                <SelectItem value="2017">2017</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGetPaymentList}>Получить расчетный лист</Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
