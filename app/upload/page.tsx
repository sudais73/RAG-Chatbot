'use client'
import { processPdfFile } from "./actions"
import { Card, CardContent } from '@/components/ui/card'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { useState } from "react"

export default function PdfUpload() {
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{
        type: 'error' | 'success',
        text: string
    } | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsLoading(true)
        setMessage(null)

        try {
            const formData = new FormData()
            formData.append('pdf', file)

            const result = await processPdfFile(formData)

            if (result.success) {
                setMessage({
                    type: 'success',
                    text: result?.message || "PDF processed successfully",
                })
                e.target.value = '' // Reset file input
            } else {
                setMessage({
                    type: "error",
                    text: result.error || "Failed to process PDF"
                })
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: "An error occurred while processing the PDF"
            })
        } finally {
            // Ensures loading state always clears whether success or failure
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    PDF Upload & Embedding
                </h1>
                
                <Card className="mb-6">
                    <CardContent className="pt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="pdf-upload">Upload PDF File</Label>
                            <Input 
                                id="pdf-upload" 
                                type="file" 
                                accept=".pdf" 
                                onChange={handleFileUpload} 
                                disabled={isLoading}
                                className="cursor-pointer"
                            />
                        </div>

                        {isLoading && (
                            <div className="flex items-center gap-2 text-primary">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm font-medium text-muted-foreground">
                                    Processing PDF and generating embeddings...
                                </span>
                            </div>
                        )}

                        {message && (
                            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                                <AlertTitle>
                                    {message.type === 'error' ? "Error" : "Success"}
                                </AlertTitle>
                                <AlertDescription>
                                    {message.text}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}