"use client"
import * as React from "react"
import { Label } from "@/components/ui/label"

export function InfoField({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="text-gray-600">{icon}</div>
        <Label className="text-xs font-bold text-gray-700 uppercase tracking-wide">{label}</Label>
      </div>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  )
}
