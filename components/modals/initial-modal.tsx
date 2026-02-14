"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";

const createServerSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
});

const joinServerSchema = z.object({
    inviteCode: z.string().min(1, {
        message: "Invite code is required."
    })
});

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isJoining, setIsJoining] = useState(false); // Kullanıcının hangi formu kullandığını kontrol etmek için

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const createForm = useForm({
        resolver: zodResolver(createServerSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const joinForm = useForm({
        resolver: zodResolver(joinServerSchema),
        defaultValues: {
            inviteCode: "",
        }
    });

    const isLoading = createForm.formState.isSubmitting || joinForm.formState.isSubmitting;

    const handleCreateSubmit = async (values: z.infer<typeof createServerSchema>) => {
        try {
            await axios.post("/api/servers", values);
            createForm.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    const handleJoinSubmit = async (values: z.infer<typeof joinServerSchema>) => {
        const { inviteCode } = values;
    
        // Davet kodu formatını kontrol et
        const validFormats = [
            "http://localhost:3000/invite/",
            "https://madcord-final.vercel.app/invite/"
        ];
    
        const isValidInviteCode = validFormats.some(format => inviteCode.startsWith(format));
    
        if (!isValidInviteCode) {
            // Hata mesajı göster
            alert("Invalid invitation code format");
            joinForm.reset(); // Giriş alanını temizle
            return; // Fonksiyondan çık
        }
    
        // Davet kodu geçerliyse yönlendirme yap
        try {
            // Burada davet kodunu kullanarak yönlendirme yapabilirsin
            window.location.href = inviteCode; // Davet koduna yönlendir
            joinForm.reset();
        } catch (error) {
            console.log(error);
        }
    };
    

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center">
                        {isJoining ? "Join a Server" : "Customize your Server"}
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        {isJoining 
                            ? "Enter your invite code to join an existing server."
                            : "Give your server a personality with a name and an image. You can always change it later."}
                    </DialogDescription>
                </DialogHeader>

                {isJoining ? (
                    <Form {...joinForm}>
                        <form onSubmit={joinForm.handleSubmit(handleJoinSubmit)} className="space-y-8">
                            <div className="space-y-8 px-6">
                                <FormField
                                    control={joinForm.control}
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
                                                    placeholder="Enter invite code"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button variant="primary" disabled={isLoading}>
                                    Join
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (
                    <Form {...createForm}>
                        <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-8">
                            <div className="space-y-8 px-6">
                                <div className="flex items-center justify-center text-center">
                                    <FormField
                                        control={createForm.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="serverImage"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={createForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Server Name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                    placeholder="Enter server name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="bg-gray-100 px-6 py-4">
                                <Button variant="primary" disabled={isLoading}>
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}

                <div className="flex justify-center mt-4">
                    <Button 
                        variant="link" 
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => setIsJoining(!isJoining)}>
                        {isJoining ? "Create a new server instead" : "Join an existing server instead"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
