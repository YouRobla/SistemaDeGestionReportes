"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import QRCode from "react-qr-code";
import jsPDF from "jspdf";
import { Download, QrCode, AlertCircle } from "lucide-react";

export default function QRGenerator() {
  const [url, setUrl] = React.useState("");
  const [validUrl, setValidUrl] = React.useState("");
  const [error, setError] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);

  const qrRef = React.useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!url.trim()) {
      setError("Por favor ingresa una URL");
      setValidUrl("");
      return;
    }
    try {
      const parsed = new URL(url);
      setValidUrl(parsed.href);
      setError("");
    } catch {
      setValidUrl("");
      setError("Por favor ingresa una URL válida (ej: https://example.com)");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleGenerate();
  };

  const handleDownloadPDF = async () => {
    if (!validUrl || !qrRef.current) return;
    setIsGenerating(true);
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 50;

      doc.setFillColor(245, 247, 250);
      doc.rect(0, 0, pageWidth, 150, "F");
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 8, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(30, 41, 59);
      const title = "REPORTE DE ACTOS Y CONDICIONES INSEGURAS";
      doc.text(title, (pageWidth - doc.getTextWidth(title)) / 2, 60);

      doc.setDrawColor(59, 130, 246);
      doc.setLineWidth(2);
      doc.line(margin, 75, pageWidth - margin, 75);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(14);
      doc.setTextColor(71, 85, 105);
      const subtitle = "Escanea este código QR para acceder al reporte completo";
      doc.text(subtitle, (pageWidth - doc.getTextWidth(subtitle)) / 2, 105);

      const svg = qrRef.current.querySelector("svg");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          canvas.width = 800;
          canvas.height = 800;
          if (ctx) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const imgData = canvas.toDataURL("image/png");

            const qrSize = 280;
            const qrX = (pageWidth - qrSize) / 2;
            const qrY = 180;

            doc.setFillColor(255, 255, 255);
            doc.roundedRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 8, 8, "F");
            doc.setDrawColor(59, 130, 246);
            doc.setLineWidth(3);
            doc.roundedRect(qrX - 20, qrY - 20, qrSize + 40, qrSize + 40, 8, 8, "S");
            doc.addImage(imgData, "PNG", qrX, qrY, qrSize, qrSize);

            doc.setFontSize(10);
            doc.setTextColor(100, 116, 139);
            doc.setFont("helvetica", "italic");
            const urlText = validUrl.length > 60 ? validUrl.substring(0, 57) + "..." : validUrl;
            doc.text(urlText, (pageWidth - doc.getTextWidth(urlText)) / 2, qrY + qrSize + 50);

            doc.save(`reporte_qr_${Date.now()}.pdf`);
            URL.revokeObjectURL(url);
          }
        };

        img.src = url;
      }
    } catch (err) {
      console.error(err);
      setError("Error al generar el PDF. Por favor intenta de nuevo.");
    } finally {
      setTimeout(() => setIsGenerating(false), 1000);
    }
  };

  return (
    <div className="min-h-screen py-4 px-2 ">
      <div className="max-w-2xl mx-auto">
        <div className=" rounded-xl shadow-xl overflow-hidden ">
          {/* Header */}
          <div className="bg-gradient-to-r from-black to-gray-900 px-8 py-6">
            <div className="flex items-center gap-3 ">
              <QrCode className="w-8 h-8 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Generador de Códigos QR</h1>
                <p className="text-blue-100 text-sm mt-1">
                  Crea códigos QR profesionales para tus reportes
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6 ">
            {/* Input Section */}
            <div className="space-y-3">
              <Label htmlFor="url">URL del Reporte</Label>
              <Input
                id="url"
                placeholder="https://ejemplo.com/reporte"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>

            <Button className="w-full" onClick={handleGenerate}>
              <QrCode className="w-5 h-5 mr-2" />
              Generar Código QR
            </Button>

            {validUrl && (
              <div className="flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-4 duration-500 ">
                {/* QR Section */}
                <div className="flex justify-center md:justify-start flex-1  ">
                  <div
                    ref={qrRef}
                    className="p-6 bg-white rounded-2xl shadow-lg border"
                  >
                    <QRCode value={validUrl} size={240} />
                  </div>
                </div>

                {/* Instructions + Button */}
                <div className="flex-1 flex flex-col p-2">
                  {/* Instrucciones arriba */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Instrucciones
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1 ml-6 list-disc">
                      <li>Descarga el PDF para compartir el código QR</li>
                      <li>Escanea con cualquier cámara de smartphone</li>
                      <li>El código redirige directamente a tu reporte</li>
                    </ul>
                  </div>
                    <div className="h-full ">
                    </div>
                  {/* Botón abajo */}
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    variant="default"
                    className="w-full mt-4 md:mt-0"
                  >
                    {isGenerating ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Generando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Descargar PDF Profesional
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Los códigos QR generados son permanentes y no expiran</p>
        </div>
      </div>
    </div>
  );
}
