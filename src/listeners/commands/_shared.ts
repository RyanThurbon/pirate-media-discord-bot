import { UIContainer } from "@/core/ui/UIContainer";
import type { ChatInputCommandDeniedPayload, ChatInputCommandErrorPayload } from "@sapphire/framework";
import { container, UserError } from "@sapphire/framework";
import type { ChatInputCommandInteraction } from "discord.js";
import { MessageFlags } from "discord.js";

export async function handleChatInputError(error: unknown, payload: ChatInputCommandErrorPayload) {
    container.logger.error(error, {
        command: payload.command,
        interaction: payload.interaction,
    });

    if (error instanceof UserError || error instanceof Error) {
        return notify(payload.interaction, error.message, true);
    }

    return notify(payload.interaction, "An unexpected error occurred while running this command.", true);
}

export async function handleChatInputDenied(error: UserError, payload: ChatInputCommandDeniedPayload) {
    if (Reflect.get(Object(payload.context), "silent")) {
        return;
    }

    return notify(payload.interaction, error.message);
}

function notify(interaction: ChatInputCommandInteraction, message: string, isError = false) {
    const container = isError ? UIContainer.error(message) : UIContainer.warn(message);

    if (interaction.deferred || interaction.replied) {
        return interaction.editReply({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });
    }

    return interaction.reply({
        components: [container],
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
    });
}
