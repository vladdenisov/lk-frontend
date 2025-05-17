"use client";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { DialogContent } from "../ui/dialog";
import { Document, Page, pdfjs } from 'react-pdf'
import { Preloader } from "../ui/preloader";
import { Button } from "../ui/button";
import { usePdf } from "@mikecousins/react-pdf";
import { PdfFocusProvider, PDFViewer } from "@llamaindex/pdf-viewer";
import '@llamaindex/pdf-viewer/index.css';
import { Download, Printer } from "lucide-react";
import printJS from 'print-js';
import styles from './pdf-dialog.module.scss';
import { useQueryClient } from "@tanstack/react-query";
interface PDFDialogProps {
  isLoading?: boolean;
  fileData?: string;
  isSigningAvailable?: boolean;
  handleSign?: () => void;
}

export function downloadPDF(pdf: string, fileName: string) {
  const linkSource = `data:application/pdf;base64,${pdf}`;
  const downloadLink = document.createElement("a");
  downloadLink.href = linkSource;
  downloadLink.download = fileName;
  downloadLink.click();
}



export const PDFDialog: FC<PDFDialogProps> = ({ isLoading, fileData, isSigningAvailable, handleSign }) => {
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const queryClient = useQueryClient();

  const pageWrapperRef = useRef<HTMLDivElement>(null);
  const [pageDisplayWidth, setPageDisplayWidth] = useState<number | undefined>();

  useEffect(() => {
    if (!fileData || !pageWrapperRef.current) {
      setPageDisplayWidth(undefined);
      return;
    }

    const measureWidth = () => {
      if (pageWrapperRef.current) {
        const style = window.getComputedStyle(pageWrapperRef.current);
        const width =
          pageWrapperRef.current.clientWidth -
          parseFloat(style.paddingLeft) -
          parseFloat(style.paddingRight);
        setPageDisplayWidth(Math.max(1, width));
      }
    };

    measureWidth();

    window.addEventListener("resize", measureWidth);
    return () => {
      window.removeEventListener("resize", measureWidth);
    };
  }, [fileData]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const handleDownload = async () => {
    if (fileData) {
      downloadPDF(fileData, 'Заявление на отпуск.pdf');
    }
  }

  const handlePrint = async () => {
    if (fileData) {
      printJS({
        printable: fileData,
        type: 'pdf',
        documentTitle: 'Заявление на отпуск.pdf',
        base64: true,
      });
      queryClient.invalidateQueries({ queryKey: ['vacationRequests'] });
    }
  }

  const canvasRef = useRef(null);

  const { pdfDocument } = usePdf({
    file: `data:application/pdf;base64,${fileData}`,
    canvasRef: canvasRef,
    onDocumentLoadSuccess: onDocumentLoadSuccess,
  });

  const file = useMemo(() => {
    return {
      id: '123',
      url: `data:application/pdf;base64,${fileData}`,
    }
  }, [fileData]);

  return (
     <DialogContent className="max-w-[90vw] max-h-[90vh] p-6 bg-white flex flex-col items-center sm:max-w-4/5 h-[90vh]">
        <div className="flex flex-col items-center w-full">
          {isLoading && <Preloader />}
          {fileData && (
            <Document
              file={{data: new Uint8Array(Buffer.from(fileData, 'base64'))}}
              onLoadSuccess={onDocumentLoadSuccess}
              options={{
                cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
                cMapPacked: true,
                standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts`,
              }}
              onLoadError={(error) => {
                console.log(error);
              }}
              className="w-full h-[80vh]"
            >
              <div ref={pageWrapperRef} className="bg-white rounded-lg shadow-lg p-4 flex justify-center">
                {numPages > 0 && (
                  <Page
                    pageNumber={pageNumber}
                    width={pageDisplayWidth}
                    devicePixelRatio={window.devicePixelRatio}
                    className="mx-auto"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                )}
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
          <div className="flex gap-2 mt-4">
            <Button onClick={() => handleDownload()}><Download className="h-4 w-4" /> Скачать</Button>
            {isSigningAvailable && handleSign && <Button onClick={() => handleSign()}>Подписать и прикрепить</Button>}
            <Button onClick={() => handlePrint()}><Printer className="h-4 w-4" /> Печать</Button>
          </div>
        </div>
      </DialogContent>
  );
}
