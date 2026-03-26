import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds } from "@/core/constants";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";
import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class PMTVTicketTrialOpenButtonHandler extends InteractionHandler {
    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== ButtonCustomIds.PMTVTicketTrialOpen) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId(ModalCustomIds.PMTVTicketTrialInfo)
            .setTitle("Your PMTV trial account details")
            .addLabelComponents(this.labelComponents);

        return interaction.showModal(modal);
    }

    private get labelComponents(): LabelBuilder[] {
        const usernameLabel = new LabelBuilder()
            .setLabel("What is your preferred account username?")
            .setDescription("The username you will use to login")
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(ModalInputCustomIds.PMTVTicketTrialInfoUsername)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true),
            );

        const passwordLabel = new LabelBuilder()
            .setLabel("What is your preferred account password?")
            .setDescription("The password you will use to login")
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(ModalInputCustomIds.PMTVTicketTrialInfoPassword)
                    .setPlaceholder("Leave blank for a randomly generated password")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false),
            );

        return [usernameLabel, passwordLabel];
    }
}
