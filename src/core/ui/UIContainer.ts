import { Colors, ContainerBuilder } from "discord.js";

export class UIContainer {
    public static plain(content: string) {
        return new ContainerBuilder().addTextDisplayComponents((text) => text.setContent(content));
    }

    public static info(content: string) {
        return new ContainerBuilder()
            .addTextDisplayComponents((text) => text.setContent(content))
            .setAccentColor(Colors.DarkBlue);
    }

    public static warn(content: string) {
        return new ContainerBuilder()
            .addTextDisplayComponents((text) => text.setContent(content))
            .setAccentColor(Colors.Yellow);
    }

    public static success(content: string) {
        return new ContainerBuilder()
            .addTextDisplayComponents((text) => text.setContent(content))
            .setAccentColor(Colors.Green);
    }

    public static error(content: string) {
        return new ContainerBuilder()
            .addTextDisplayComponents((text) => text.setContent(content))
            .setAccentColor(Colors.Red);
    }
}
