import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds, SUPPORT_TICKET_CATEGORIES } from "@/core/constants";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";
import { LabelBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class SupportTicketOpenButtonHandler extends InteractionHandler {
    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== ButtonCustomIds.SupportTicketOpen) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId(ModalCustomIds.SupportTicketInfo)
            .setTitle("Create a ticket")
            .addLabelComponents(this.labelComponents);

        return interaction.showModal(modal);
    }

    private get labelComponents(): LabelBuilder[] {
        const categoryLabel = new LabelBuilder()
            .setLabel("Select the category for your issue")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.SupportTicketInfoCategory)
                    .setPlaceholder("Select a category")
                    .addOptions(
                        SUPPORT_TICKET_CATEGORIES.map((category) => ({
                            label: category,
                            value: category.toLowerCase(),
                        })),
                    )
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setRequired(true),
            );

        const issueLabel = new LabelBuilder()
            .setLabel("Please describe the issue you are having")
            .setDescription("Provide as much detail as possible")
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(ModalInputCustomIds.SupportTicketInfoIssue)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true),
            );

        return [categoryLabel, issueLabel];
    }
}
