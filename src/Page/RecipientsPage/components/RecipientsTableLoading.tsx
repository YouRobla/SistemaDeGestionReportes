"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

interface RecipientsTableLoadingProps {
  onRetry: () => void;
  error?: string;
}

export function RecipientsTableLoading({ onRetry, error }: RecipientsTableLoadingProps) {
  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium mb-2">Error al cargar profesores</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <Button onClick={onRetry} variant="outline">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando profesores...</p>
      </div>
    </div>
  );
}
