"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// HATA BURADAYDI: useModalStore yerine useModal kullanıyoruz
import { useModal } from "@/hooks/use-modal-store";

const formSchema = z.object({
    inviteCode: z.string().min(1, {
        message: "Invite code is required."
    })
});

export const JoinServerModal = () => {
    // BURAYI DA GÜNCELLEDİK
    const { isOpen, onClose, type, onOpen } = useModal();
    const router = useRouter();

    const isModalOpen = isOpen && type === "joinServer";

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { inviteCode: "" }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Kullanıcı davet linkinin tamamını girerse sadece sonundaki id'yi almak için:
            const code = values.inviteCode.split("/").pop(); 
            
            // Davet rotasına yönlendiriyoruz
            router.push(`/invite/${code}`);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        Join a Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Enter your invite code or link to join an existing server.
                    </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField 
                                control={form.control}
                                name="inviteCode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            Invite Code
                                        </FormLabel>
                                        <FormControl>
                                            <Input 
                                                disabled={isLoading} 
                                                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter invite code or link"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-y-4">
                            <Button 
                                type="button"
                                variant="ghost"
                                onClick={() => onOpen("createServer")}
                                className="text-sm text-zinc-500 hover:text-zinc-600 hover:bg-transparent hover:underline transition"
                            >
                                Create a new server instead
                            </Button>
                            
                            <Button disabled={isLoading} variant="primary">
                                Join
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}