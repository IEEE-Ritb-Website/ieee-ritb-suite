import { appConfig } from "@/configs/config";
import { FlipSentences } from "./flip-sentences";
import { Mail, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProfileSection = ({ className }: { className?: string }) => {
    return (
        <div className={cn("w-full flex flex-col items-center", className)}>
            <div className="flex md:items-end md:flex-row flex-col items-center gap-4 md:gap-8 max-w-4xl w-full px-6 md:px-0 mt-10">
                {/* profile pic */}
                <div className="w-28 h-28 md:w-42 md:h-42 overflow-hidden rounded-full bg-gray-600">
                    <img
                        src={appConfig.profile.image}
                        className="h-full w-full object-cover"
                        alt="pfp"
                    />
                </div>
                {/* profile info */}
                <div className="flex flex-col md:items-start items-center">
                    <div className="flex items-center justify-center gap-2">
                        <div className="font-semibold text-2xl md:text-3xl text-white">{appConfig.profile.name}</div>
                    </div>
                    <div className="mb-2">
                        <FlipSentences sentences={appConfig.profile.sentences} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="text-white flex gap-2 items-center">
                            <div className="p-1 bg-blue-100/5 rounded-md text-white/60 border-l-2 border-t-2 border-b border-r border-blue-400/10 shadow-md shadow-blue-300/50">
                                <MapPin className="h-3.5 w-3.5" />
                            </div>
                            <span>{appConfig.profile.location}</span>
                        </div>
                        <div className="text-white flex gap-2 items-center">
                            <div className="p-1 bg-blue-100/5 rounded-md text-white/60 border-l-2 border-t-2 border-b border-r border-blue-400/10 shadow-md shadow-blue-300/50">
                                <Mail className="h-3.5 w-3.5" />
                            </div>
                            <a href={`mailto:${appConfig.profile.email}`}>
                                {appConfig.profile.email}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};