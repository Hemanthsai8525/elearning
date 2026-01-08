import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button } from "./Button"
const Dialog = ({ open, onOpenChange, children }) => {
    return (
        <AnimatePresence>
            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => onOpenChange(false)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                    />
                    <div className="relative z-50 w-full max-w-lg mx-4">
                        {children}
                    </div>
                </div>
            )}
        </AnimatePresence>
    )
}
const DialogContent = ({ className, children, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "bg-background border rounded-xl shadow-2xl overflow-hidden",
                className
            )}
        >
            {children}
        </motion.div>
    )
}
const DialogHeader = ({ className, children }) => (
    <div className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}>
        {children}
    </div>
)
const DialogTitle = ({ className, children }) => (
    <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
        {children}
    </h3>
)
const DialogDescription = ({ className, children }) => (
    <p className={cn("text-sm text-muted-foreground", className)}>
        {children}
    </p>
)
const DialogFooter = ({ className, children }) => (
    <div className={cn("flex items-center justify-end gap-3 p-6 pt-0 bg-muted/20", className)}>
        {children}
    </div>
)
const AlertDialog = ({ open, onOpenChange, title, description, onConfirm, loading, cancelText = "Cancel", confirmText = "Continue", variant = "destructive" }) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md border-destructive/20 ring-1 ring-destructive/10">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="pt-2 text-base">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="pt-4 pb-6 bg-transparent">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        disabled={loading}
                        className={cn(variant === 'destructive' && "bg-red-600 hover:bg-red-700 text-white")}
                    >
                        {loading ? "Processing..." : confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, AlertDialog }
