"use client";

import { 
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
 } from "@/components/ui/tooltip";

 interface ActionTooltipProps {
    label: string;
    children: React.ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center"| "end";

 }

 export const ActionToolTip = ({
    label,
    children,
    side,
    align
 }: ActionTooltipProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent side={side} align={align}>
                    <p>
                        {label.toLowerCase()}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
 }