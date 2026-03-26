import {
    ButtonCustomIds,
    ModalCustomIds,
    ModalInputCustomIds,
    PMTV_DEVICE_CONNECTIONS,
    PMTV_PAYMENT_METHODS,
    PMTV_PLAN_DURATIONS,
} from "@/core/constants";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction, SelectMenuComponentOptionData } from "discord.js";
import { LabelBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class PMTVTicketPurchaseOpenButtonHandler extends InteractionHandler {
    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== ButtonCustomIds.PMTVTicketPurchaseOpen) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId(ModalCustomIds.PMTVTicketPurchaseInfo)
            .setTitle("Your PMTV account details")
            .addLabelComponents(this.labelComponents);

        return interaction.showModal(modal);
    }

    private get labelComponents(): LabelBuilder[] {
        const usernameLabel = new LabelBuilder()
            .setLabel("What is your preferred account username?")
            .setDescription("The username you will use to login")
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(ModalInputCustomIds.PMTVTicketPurchaseInfoUsername)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true),
            );

        const passwordLabel = new LabelBuilder()
            .setLabel("What is your preferred account password?")
            .setDescription("The password you will use to login")
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(ModalInputCustomIds.PMTVTicketPurchaseInfoPassword)
                    .setPlaceholder("Leave blank for a randomly generated password")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false),
            );

        const durationLabel = new LabelBuilder()
            .setLabel("Select the duration of your plan")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.PMTVTicketPurchaseInfoDuration)
                    .setPlaceholder("Select a plan")
                    .addOptions(this.planDurations)
                    .setRequired(true),
            );

        const connectionsLabel = new LabelBuilder()
            .setLabel("Select the number of connections")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.PMTVTicketPurchaseInfoConnections)
                    .setPlaceholder("Number of connections")
                    .addOptions(this.deviceConnections)
                    .setRequired(true),
            );

        const paymentLabel = new LabelBuilder()
            .setLabel("Select your payment method")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.PMTVTicketPurchaseInfoMethod)
                    .setPlaceholder("Payment method")
                    .addOptions(this.paymentMethods)
                    .setRequired(true),
            );

        return [usernameLabel, passwordLabel, durationLabel, connectionsLabel, paymentLabel];
    }

    private get planDurations(): SelectMenuComponentOptionData[] {
        return PMTV_PLAN_DURATIONS.map((duration) => ({
            label: duration,
            value: duration,
        }));
    }

    private get deviceConnections(): SelectMenuComponentOptionData[] {
        return PMTV_DEVICE_CONNECTIONS.map((connectionCount) => ({
            label: `${connectionCount} connections`,
            value: connectionCount.toString(),
        }));
    }

    private get paymentMethods(): SelectMenuComponentOptionData[] {
        return PMTV_PAYMENT_METHODS.map((method) => ({
            label: method,
            value: method,
        }));
    }
}
