import { UIColors } from "@/lib/constants";
import { ContainerBuilder, TextDisplayBuilder } from "discord.js";

export class UIMessage {
    public static info(content: string) {
        return this.create(content, UIColors.Info);
    }

    public static warning(content: string) {
        return this.create(content, UIColors.Warning);
    }

    public static success(content: string) {
        return this.create(content, UIColors.Success);
    }

    public static error(content: string) {
        return this.create(content, UIColors.Error);
    }

    private static create(content: string, color: number) {
        return new ContainerBuilder()
            .addTextDisplayComponents(new TextDisplayBuilder().setContent(content))
            .setAccentColor(color);
    }
}
