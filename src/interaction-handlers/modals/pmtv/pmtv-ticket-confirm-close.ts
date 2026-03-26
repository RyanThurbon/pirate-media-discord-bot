import { ModalCustomIds, ModalInputCustomIds } from "@/core/constants";
import { UIContainer } from "@/core/ui/UIContainer";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes, UserError } from "@sapphire/framework";
import { Time } from "@sapphire/time-utilities";
import { cast, isNullOrUndefined } from "@sapphire/utilities";
import type { ModalSubmitInteraction } from "discord.js";
import { MessageFlags } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class PMTVTicketConfirmCloseModalSubmitHandler extends InteractionHandler {
    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== ModalCustomIds.PMTVTicketConfirmClose) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const channel = interaction.channel;

        if (isNullOrUndefined(channel)) {
            throw new UserError({
                identifier: "NoChannelContext",
                message: "This action must be performed within a valid channel.",
            });
        }

        const confirmation = cast<string>(
            interaction.fields.getStringSelectValues(ModalInputCustomIds.PMTVTicketConfirmCloseConfirmation)[0],
        );

        if (confirmation !== "yes") {
            return interaction.editReply({
                components: [UIContainer.info("This ticket will remain open.")],
                flags: [MessageFlags.IsComponentsV2],
            });
        }

        await interaction.editReply({
            components: [UIContainer.success("This ticket will be closed shortly...")],
            flags: [MessageFlags.IsComponentsV2],
        });

        setTimeout(async () => {
            await channel.delete(`Ticket closed by: ${interaction.user.displayName}`);
        }, Time.Second * 5);
    }
}
