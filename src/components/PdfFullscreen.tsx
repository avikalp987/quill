import { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

interface PdfFullscreenProps{
    url: string
}

const PdfFullscreen = ({url}: PdfFullscreenProps) => {

    //keep track of the open state
    const [isOpen,setIsOpen] = useState(false)

    const { toast } = useToast()

    //getting the number of pages
    const [numPages, setNumPages] = useState<number>()


    const { width, ref } = useResizeDetector()

    return ( 
        <Dialog
            open={isOpen}
            onOpenChange={(v) => {
                if(!v)
                {
                    setIsOpen(v)
                }
            }}
        >
            
            <DialogTrigger asChild onClick={() => setIsOpen(true)}> 
                <Button 
                    aria-label="fullscreen" 
                    variant="ghost" 
                    className="gap-1.5"
                >
                    <Expand className="h-4 w-4"/>
                </Button>
            </DialogTrigger>

            <DialogContent
                className="max-w-7xl w-full"
            >
                <SimpleBar
                    autoHide={false}
                    className="max-h-[calc(100vh-10rem)] mt-6"
                >
                    
                <div
                    ref={ref}
                >
                    <Document 
                        loading={
                            <div className="flex justify-center">
                                <Loader2 className="my-24 h-6 w-6 animate-apin"/>
                            </div>
                        } 
                        onLoadError={() => {
                            toast({
                                title: "Error Loading PDF",
                                description: "Please try again later",
                                variant: "destructive"
                            })
                        }}
                        onLoadSuccess={({numPages}) => {
                            setNumPages(numPages)
                        }}
                        file={url} 
                        className="max-h-full"
                    >
                        {new Array(numPages).fill(0).map((_, index) => (
                            <Page
                                key={index}
                                width={width?width:1}
                                pageIndex={index}
                            />
                        ))}
                    </Document>
                </div>
                
                </SimpleBar>
            </DialogContent>

        </Dialog>
     );
}
 
export default PdfFullscreen;