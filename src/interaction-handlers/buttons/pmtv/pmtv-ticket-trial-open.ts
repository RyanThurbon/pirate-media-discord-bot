import { ButtonCustomIds, ModalCustomIds, ModalInputCustomIds } from "@/lib/constants";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";
import { LabelBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class PMTVTicketTrialOpenButtonHandler extends InteractionHandler {
    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== ButtonCustomIds.pmtv.trial.open) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId(ModalCustomIds.pmtv.trial.info)
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
                    .setCustomId(ModalInputCustomIds.pmtv.trial.username)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true),
            );

        const passwordLabel = new LabelBuilder()
            .setLabel("What is your preferred account password?")
            .setDescription("The password you will use to login")
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(ModalInputCustomIds.pmtv.trial.password)
                    .setPlaceholder("Leave blank for a randomly generated password")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false),
            );

        return [usernameLabel, passwordLabel];
    }
}
