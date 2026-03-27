import { ModalCustomIds, ModalInputCustomIds } from "@/lib/constants";
import { UIMessage } from "@/lib/ui/UIMessage";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { cast } from "@sapphire/utilities";
import type { GuildTextBasedChannel, ModalSubmitInteraction } from "discord.js";
import { MessageFlags } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class SupportTicketConfirmCloseModalSubmitHandler extends InteractionHandler {
    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== ModalCustomIds.support.confirmClose) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const channel = cast<GuildTextBasedChannel>(interaction.channel);

        const fields = interaction.fields;

        const ids = {
            closeTicketConfirmation: ModalInputCustomIds.support.confirmCloseConfirmation,
        };

        const confirmation = cast<"yes" | "no">(fields.getStringSelectValues(ids.closeTicketConfirmation)[0]);

        if (confirmation !== "yes") {
            return interaction.editReply({
                components: [UIMessage.info("This ticket will remain open.")],
                flags: [MessageFlags.IsComponentsV2],
            });
        }

        await interaction.editReply({
            components: [UIMessage.success("This ticket will be closed shortly...")],
            flags: [MessageFlags.IsComponentsV2],
        });

        setTimeout(async () => {
            await channel.delete(`Ticket closed by: ${interaction.user.displayName}`);
        }, Time.Second * 5);
    }
}
