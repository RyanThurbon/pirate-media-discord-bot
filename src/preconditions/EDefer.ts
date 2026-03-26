import { Precondition, type ChatInputCommand } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";

export class EDeferPrecondition extends Precondition {
    public override async chatInputRun(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
        return this.ok();
    }
}

declare module "@sapphire/framework" {
    interface Preconditions {
        EDefer: never;
    }
}
