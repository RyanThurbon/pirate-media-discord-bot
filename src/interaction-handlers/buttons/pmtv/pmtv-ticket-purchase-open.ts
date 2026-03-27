import {
    ButtonCustomIds,
    ModalCustomIds,
    ModalInputCustomIds,
    PMTV_DEVICE_CONNECTIONS,
    PMTV_PAYMENT_METHODS,
    PMTV_PLAN_DURATIONS,
} from "@/lib/constants";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { cast } from "@sapphire/utilities";
import type { ButtonInteraction, SelectMenuComponentOptionData } from "discord.js";
import { LabelBuilder, ModalBuilder, StringSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class PMTVTicketPurchaseOpenButtonHandler extends InteractionHandler {
    public override parse(interaction: ButtonInteraction) {
        if (interaction.customId !== ButtonCustomIds.pmtv.purchase.open) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ButtonInteraction) {
        const modal = new ModalBuilder()
            .setCustomId(ModalCustomIds.pmtv.purchase.info)
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
                    .setCustomId(ModalInputCustomIds.pmtv.purchase.username)
                    .setStyle(TextInputStyle.Short)
                    .setRequired(true),
            );

        const passwordLabel = new LabelBuilder()
            .setLabel("What is your preferred account password?")
            .setDescription("The password you will use to login")
            .setTextInputComponent(
                new TextInputBuilder()
                    .setCustomId(ModalInputCustomIds.pmtv.purchase.password)
                    .setPlaceholder("Leave blank for a randomly generated password")
                    .setStyle(TextInputStyle.Short)
                    .setRequired(false),
            );

        const planLabel = new LabelBuilder()
            .setLabel("Select the duration of your plan")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.pmtv.purchase.plan)
                    .setPlaceholder("Select a plan")
                    .addOptions(this.planDurations)
                    .setRequired(true),
            );

        const connectionsLabel = new LabelBuilder()
            .setLabel("Select the number of connections")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.pmtv.purchase.connections)
                    .setPlaceholder("Number of connections")
                    .addOptions(this.deviceConnections)
                    .setRequired(true),
            );

        const paymentLabel = new LabelBuilder()
            .setLabel("Select your payment method")
            .setStringSelectMenuComponent(
                new StringSelectMenuBuilder()
                    .setCustomId(ModalInputCustomIds.pmtv.purchase.method)
                    .setPlaceholder("Payment method")
                    .addOptions(this.paymentMethods)
                    .setRequired(true),
            );

        return [usernameLabel, passwordLabel, planLabel, connectionsLabel, paymentLabel];
    }

    private get planDurations(): SelectMenuComponentOptionData[] {
        return PMTV_PLAN_DURATIONS.map((duration) => ({
            label: duration,
            value: duration,
        }));
    }

    private get deviceConnections(): SelectMenuComponentOptionData[] {
        return PMTV_DEVICE_CONNECTIONS.map((count) => ({
            label: `${count} connections`,
            value: cast<string>(count),
        }));
    }

    private get paymentMethods(): SelectMenuComponentOptionData[] {
        return PMTV_PAYMENT_METHODS.map((method) => ({
            label: method,
            value: method,
        }));
    }
}
