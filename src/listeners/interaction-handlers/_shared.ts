import { UIMessage } from "@/lib/ui/UIMessage";
import { container, UserError, type InteractionHandlerError, type InteractionHandlerParseError } from "@sapphire/framework";
import { MessageFlags, type Interaction } from "discord.js";

export async function handleInteractionHandlerError(
    error: unknown,
    payload: InteractionHandlerError | InteractionHandlerParseError,
) {
    container.logger.error(error, {
        handler: payload.handler,
        interaction: payload.interaction,
    });

    if (error instanceof UserError || error instanceof Error) {
        return notify(payload.interaction, error.message);
    }

    return notify(payload.interaction, "An unexpected error occurred while running this command.");
}

function notify(interaction: Interaction, message: string) {
    if (!interaction.isButton() && !interaction.isModalSubmit()) {
        return;
    }

    if (interaction.deferred || interaction.replied) {
        return interaction.editReply({
            components: [UIMessage.error(message)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }

    return interaction.reply({
        components: [UIMessage.error(message)],
        flags: [MessageFlags.Ephemeral, MessageFlags.IsComponentsV2],
    });
}
