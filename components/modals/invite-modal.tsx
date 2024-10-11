"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use.origin";
import { useState } from "react";
import axios from "axios";

export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data || {}; // `data` ve `server` objesinin var olup olmadığını kontrol et

    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inviteCode, setInviteCode] = useState(server?.inviteCode || ""); // İlk başta inviteCode boş olabilir

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            setInviteCode(response.data.inviteCode); // Yeni davet kodunu duruma kaydedin
            alert("New invite code generated successfully!"); // Başarı mesajı göster
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    // Eğer inviteCode boşsa "Please generate a new link" mesajını göster
    const inviteUrl = inviteCode ? `${origin}/invite/${inviteCode}` : "Please generate a new link";

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input disabled={isLoading} className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        value={inviteUrl} // inviteUrl ya gerçek link ya da mesaj olacak
                        />
                        <Button disabled={isLoading || inviteUrl === "Please generate a new link"} onClick={onCopy} size="icon">
                            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                        </Button>
                    </div>
                    <Button onClick={onNew} disabled={isLoading} variant="link" size="sm" className="text-xs text-zinc-500 mt-4">
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
