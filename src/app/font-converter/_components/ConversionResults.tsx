import { Button } from "@/components/ui/button"
import { Download, FileText, Loader2, Package } from "lucide-react"
import JSZip from 'jszip'

interface ConversionResultsProps {
  files: Array<{
    format: string
    url: string
    size: string
  }>
  isConverting: boolean
}

export function ConversionResults({ files, isConverting }: ConversionResultsProps) {
  if (isConverting) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 bg-primary/10 rounded-full mb-4">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
        <p className="font-medium">Converting your font...</p>
        <p className="text-sm text-muted-foreground">This may take a few moments</p>
      </div>
    )
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="p-3 bg-muted rounded-full mb-4">
          <Package className="w-6 h-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-muted-foreground">No files converted yet</p>
        <p className="text-sm text-muted-foreground">Upload a font and select formats to begin</p>
      </div>
    )
  }

  const handleDownloadAll = async () => {
    const zip = new JSZip()
    const promises = files.map(async (file) => {
      const response = await fetch(file.url)
      const blob = await response.blob()
      zip.file(`font.${file.format.toLowerCase()}`, blob)
    })

    await Promise.all(promises)

    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = 'converted_fonts.zip'
    link.click()
    URL.revokeObjectURL(link.href)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{files.length} files converted</p>
        <Button variant="outline" size="sm" onClick={handleDownloadAll}>
          <Package className="w-4 h-4 mr-2" />
          Download All
        </Button>
      </div>

      <div className="space-y-2">
        {files.map((file, index) => (
          <div 
            key={index} 
            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary/10 rounded">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">font.{file.format.toLowerCase()}</p>
                <p className="text-xs text-muted-foreground">{file.size}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              asChild
            >
              <a href={file.url} download={`font.${file.format.toLowerCase()}`}>
                <Download className="w-4 h-4" />
              </a>
            </Button>
          </div>
        ))}
      </div>

      <div className="pt-2 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Files are ready for download
        </p>
      </div>
    </div>
  )
}