"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import type { ResumeData } from "@/types/resume"
import { generatePdfFilename } from "@/lib/resume-utils"
import dynamic from "next/dynamic"

const DynamicPDFDownloadLink = dynamic(
  () => import("./pdf-viewer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

interface PDFExportButtonProps {
  resumeData: ResumeData
  variant?: "default" | "outline"
  size?: "default" | "sm"
}

export function PDFExportButton({ resumeData, variant = "default", size = "default" }: PDFExportButtonProps) {
  const fileName = generatePdfFilename(resumeData.title)

  const openPDFPreview = () => {
    // 将简历数据编码为URL参数
    const encodedData = encodeURIComponent(JSON.stringify(resumeData))
    // 打开新窗口
    window.open(`/pdf-preview?data=${encodedData}`, '_blank')
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={openPDFPreview}
        className="gap-2"
      >
        <Icon icon="mdi:file-pdf-box" className="w-4 h-4" />
        {variant === "outline" ? "PDF预览" : "导出PDF"}
      </Button>
    </>
  )
}

export default PDFExportButton
