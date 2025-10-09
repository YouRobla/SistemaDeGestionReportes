"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Image, ChevronLeft, ChevronRight } from "lucide-react"
import type { Report } from "@/types"

interface EvidenceDialogProps {
  report: Report
  openEvidencia: boolean
  setOpenEvidencia: (open: boolean) => void
  selectedImage: number
  setSelectedImage: React.Dispatch<React.SetStateAction<number>>
}

export function EvidenceDialog({
  report,
  openEvidencia,
  setOpenEvidencia,
  selectedImage,
  setSelectedImage,
}: EvidenceDialogProps) {
  if (!report?.evidencias?.length) return null

  const total = report.evidencias.length
  const currentImage = report.evidencias[selectedImage]

  const handlePrev = () => setSelectedImage(prev => prev > 0 ? prev - 1 : total - 1)
  const handleNext = () => setSelectedImage(prev => prev < total - 1 ? prev + 1 : 0)

  return (
    <Dialog open={openEvidencia} onOpenChange={setOpenEvidencia}>
      <DialogContent className="max-w-[70vw] max-h-[85vh] sm:max-w-[60vw] md:max-w-[50vw] p-4 overflow-hidden">
        <DialogHeader className="pb-1 sm:pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-1 sm:gap-2 text-sm sm:text-lg">
              <Image className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Evidencia {selectedImage + 1} de {total}</span>
              <span className="sm:hidden">{selectedImage + 1}/{total}</span>
            </DialogTitle>
        
          </div>
        </DialogHeader>
        <div className="flex-1 flex flex-col">
          {/* Imagen principal */}
          <div className="flex-1 relative bg-gray-100 rounded-lg flex items-center justify-center min-h-[40vh] max-h-[60vh] p-4 overflow-hidden">
            {currentImage?.url ? (
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={currentImage.url} 
                  alt={`Evidencia ${selectedImage + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg transition-all duration-300 ease-in-out"
                  style={{
                    opacity: 1,
                    transform: 'scale(1)',
                  }}
                />
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <Image className="h-16 w-16 mx-auto mb-2" />
                <p>Sin imagen disponible</p>
              </div>
            )}
          </div>

          {/* Controles de navegación */}
          {total > 1 && (
            <div className="mt-4 space-y-3">
              {/* Flechas de navegación */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-6 py-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Anterior</span>
                  <span className="sm:hidden">←</span>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-2"
                >
                  <span className="hidden sm:inline">Siguiente</span>
                  <span className="sm:hidden">→</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Contador de imágenes */}
              <div className="flex justify-center">
                <div className="flex gap-2">
                  {report.evidencias.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        index === selectedImage 
                          ? 'bg-blue-600 scale-110' 
                          : 'bg-gray-300 hover:bg-gray-400 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
