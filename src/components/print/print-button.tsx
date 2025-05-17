"use client";

import { Printer } from "lucide-react";
import { Button } from "../ui/button";
import { callProxy } from "@/lib/callProxy";
import { Dialog } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { downloadPDF, PDFDialog } from "./pdf-dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
export function PrintButton({
  id,
  type,
  isSignAvailable,
}: {
  id: string | undefined;
  type: string;
  isSignAvailable: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const getPDF = async () => {
    if (!id) {
      setMessage("Необходимо сохранить заявку");
      setOpen(true);
      return;
    }
    setLoading(true);
    setIsModalOpen(true);
    const pdf = await callProxy<{ pdf: string }>(
      `/${type}/print?GUID=${id}`,
      "GET"
    );
    console.log(pdf);
    setUrl(pdf.pdf);
    setLoading(false);
  };

  const handleSign = async () => {
    if (url) {
      const signedPdf = await callProxy<{ signedPdfBase64: string }>(
        `/signer/signPdf`,
        "POST",
        {
          pdfBase64: url,
          docGUID: id,
          docType: "vacationRequest",
        }
      );
      console.log(signedPdf);
      downloadPDF(
        signedPdf.signedPdfBase64,
        "Заявление на отпуск_Подписанное.pdf"
      );
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Button type="button" onClick={() => getPDF()}>
        Сформировать заявление <Printer className="h-4 w-4" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Необходимо сохранить заявку</AlertDialogTitle>
            <AlertDialogDescription>
              Перед печатью заявления необходимо записать заявку в систему.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Закрыть</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <PDFDialog
        isLoading={loading}
        fileData={url ?? ""}
        isSigningAvailable={isSignAvailable}
        handleSign={handleSign}
      />
    </Dialog>
  );
}
