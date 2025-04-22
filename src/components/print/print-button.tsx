"use client";

import { Printer } from "lucide-react";
import { Button } from "../ui/button";
import { callProxy } from "@/lib/callProxy";
import { Document, Page, pdfjs } from 'react-pdf'
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTrigger } from "../ui/dialog";
import { useState } from "react";
import { Preloader } from "../ui/preloader";
import { Buffer } from 'buffer';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export function PrintButton({ id, type }: { id: string, type: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);

  const handlePrint = async () => {
    setLoading(true);
    const pdf = await callProxy<{pdf: string}>(`/${type}/print?GUID=${id}`, 'GET');
    console.log(pdf);
    setUrl(pdf.pdf);
    setLoading(false);
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={() => handlePrint()}>
          Сформировать заявление <Printer className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-6 bg-white flex flex-col items-center sm:max-w-4/5">
        <div className="flex flex-col items-center w-full">
          {loading && <Preloader />}
          {url && (
            <Document 
              file={{data: new Uint8Array(new Buffer(url, 'base64'))}}
              onLoadSuccess={onDocumentLoadSuccess}
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                cMapPacked: true,
              }}
              className="w-full"
            >
              <div className="bg-white rounded-lg shadow-lg p-4 flex">
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  className="mx-auto"
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  width={560}
                />
              </div>
              <div className="flex justify-between items-center w-full mt-4 px-4">
                <Button
                  variant="outline"
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                >
                  Предыдущая
                </Button>
                <span className="text-sm font-medium">
                  Страница {pageNumber} из {numPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
                  disabled={pageNumber >= numPages}
                >
                  Следующая
                </Button>
              </div>
            </Document>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}