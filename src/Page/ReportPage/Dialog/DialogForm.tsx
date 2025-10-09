"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger} from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { ReportDialogMobile } from "./ReportDialogMobile"
import { ReportDialogDesktop } from "./ReportDialogDesktop"
import { EvidenceDialog } from "./EvidenceDialog"
import { Eye } from "lucide-react"
import type { Report } from "@/types"

interface ReportViewerProps {
  report: Report;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  showActionsButton?: boolean; // 🚀 Nueva prop para controlar el botón de acciones
}

export default function ReportViewer({ report, open, setOpen, showActionsButton = false }: ReportViewerProps) {
  const [openEvidencia, setOpenEvidencia] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(0);
  const isMobile = useIsMobile();

  return (
    <div>
      {/* Dialog Principal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 hover:text-blue-800 transition-colors"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </DialogTrigger>

        {isMobile ? (
          <ReportDialogMobile 
            report={report} 
            setOpenEvidencia={setOpenEvidencia} 
            setSelectedImage={setSelectedImage}
            showActionsButton={showActionsButton}
          />
        ) : (
          <ReportDialogDesktop 
            report={report} 
            setOpenEvidencia={setOpenEvidencia} 
            setSelectedImage={setSelectedImage}
            showActionsButton={showActionsButton}
          />
        )}
      </Dialog>

      {/* Dialog de Evidencia */}
      <EvidenceDialog 
        report={report} 
        openEvidencia={openEvidencia} 
        setOpenEvidencia={setOpenEvidencia} 
        selectedImage={selectedImage} 
        setSelectedImage={setSelectedImage} 
      />
    </div>
  );
}


