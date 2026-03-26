import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds } from "@/core/constants";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";
import { LabelBuilder, ModalBuilder, StringSelectMenuBuilder } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class SupportTicketCloseButtonHandler extends InteractionHandler {
    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== ButtonCustomIds.SupportTicketClose) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId(ModalCustomIds.SupportTicketConfirmClose)
            .setTitle("Close your ticket")
            .addLabelComponents(this.labelComponents);

        return interaction.showModal(modal);
    }

    private get labelComponents(): LabelBuilder[] {
        const confirmationLabel = new LabelBuilder()
            .setLabel("Confirm that you want to close your ticket")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.SupportTicketConfirmCloseConfirmation)
                    .setPlaceholder("Are you sure?")
                    .addOptions(
                        ["Yes", "No"].map((option) => ({
                            label: option,
                            value: option.toLowerCase(),
                        })),
                    )
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setRequired(true),
            );

        return [confirmationLabel];
    }
}
