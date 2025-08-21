"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import type { ResumeData } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Icon } from "@iconify/react"
import { generatePdfFilename } from "@/lib/resume-utils"

// 动态导入 PDF 组件，禁用 SSR
const DynamicPDFViewer = dynamic(
  () => import("@/components/pdf-viewer").then((mod) => mod.PDFViewer),
  { ssr: false }
)

const DynamicPDFDownloadLink = dynamic(
  () => import("@/components/pdf-viewer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

function PDFPreviewContent() {
  const searchParams = useSearchParams()
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  
  useEffect(() => {
    const resumeDataParam = searchParams.get("data")
    if (resumeDataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(resumeDataParam))
        setResumeData(decodedData)
      } catch (error) {
        console.error("Failed to parse resume data:", error)
      }
    }
  }, [searchParams])

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">正在加载简历数据...</p>
      </div>
    )
  }

  const fileName = generatePdfFilename(resumeData.title)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">PDF预览</h1>
        <div className="flex gap-2">
          <Button onClick={() => window.close()} variant="outline" size="sm" className="gap-2">
            <Icon icon="mdi:close" className="w-4 h-4" />
            关闭
          </Button>
          <DynamicPDFDownloadLink resumeData={resumeData} fileName={fileName}>
            <Button size="sm" className="gap-2">
              <Icon icon="mdi:download" className="w-4 h-4" />
              下载PDF
            </Button>
          </DynamicPDFDownloadLink>
        </div>
      </div>
      <div className="flex-1 overflow-hidden flex">
        <div className="w-full h-full">
          <DynamicPDFViewer resumeData={resumeData} />
        </div>
      </div>
    </div>
  )
}

export default function PDFPreviewPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-lg mb-4">加载中...</p>
      </div>
    }>
      <PDFPreviewContent />
    </Suspense>
  )
}
