import { Precondition } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";

export class DeferPrecondition extends Precondition {
    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        return this.ok();
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        Defer: never;
    }
}
