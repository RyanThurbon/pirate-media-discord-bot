import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds, SUPPORT_TICKET_CATEGORIES } from "@/lib/constants";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";
import { LabelBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class SupportTicketOpenButtonHandler extends InteractionHandler {
    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== ButtonCustomIds.support.open) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId(ModalCustomIds.support.info)
            .setTitle("Create a help ticket")
            .addLabelComponents(this.labelComponents);

        return interaction.showModal(modal);
    }

    private get labelComponents(): LabelBuilder[] {
        const categoryLabel = new LabelBuilder().setLabel("Select the category for your issue").setStringSelectMenuComponent(
            new StringSelectMenuBuilder()
                .setCustomId(ModalInputCustomIds.support.category)
                .setPlaceholder("Select a category")
                .addOptions(
                    SUPPORT_TICKET_CATEGORIES.map((category) => ({
                        label: category,
                        value: category,
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
                    .setCustomId(ModalInputCustomIds.support.issue)
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true),
            );

        return [categoryLabel, issueLabel];
    }
}
