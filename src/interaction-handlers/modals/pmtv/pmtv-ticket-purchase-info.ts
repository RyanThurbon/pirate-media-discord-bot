import {
    ButtonCustomIds,
    ChannelParentIds,
    ModalCustomIds,
    ModalInputCustomIds,
    PMTV_PRICE_MAP,
    type PMTVConnectionCount,
    type PMTVPricingPlan,
} from "@/core/constants";
import { UIContainer } from "@/core/ui/UIContainer";
import { UIContainerBuilder } from "@/core/ui/UIContainerBuilder";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes, UserError } from "@sapphire/framework";
import { cast, isNullishOrEmpty, isNullOrUndefined } from "@sapphire/utilities";
import type { ModalSubmitInteraction } from "discord.js";
import {
    bold,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    Colors,
    HeadingLevel,
    hyperlink,
    MessageFlags,
} from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class PMTVTicketPurchaseInfoModalSubmitHandler extends InteractionHandler {
    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== ModalCustomIds.PMTVTicketPurchaseInfo) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const username = interaction.fields.getTextInputValue(ModalInputCustomIds.PMTVTicketPurchaseInfoUsername);
        const duration = cast<string>(
            interaction.fields.getStringSelectValues(ModalInputCustomIds.PMTVTicketPurchaseInfoDuration)[0],
        );
        const connections = cast<string>(
            interaction.fields.getStringSelectValues(ModalInputCustomIds.PMTVTicketPurchaseInfoConnections)[0],
        );
        const paymentMethod = cast<string>(
            interaction.fields.getStringSelectValues(ModalInputCustomIds.PMTVTicketPurchaseInfoMethod)[0],
        );
        let password = interaction.fields.getTextInputValue(ModalInputCustomIds.PMTVTicketPurchaseInfoPassword);

        if (isNullishOrEmpty(password)) {
            password = "Randomly generated";
        }

        if (isNullOrUndefined(interaction.guild)) {
            throw new UserError({
                identifier: "NoGuildContext",
                message: "This modal can only be submitted within a server.",
            });
        }

        const category = "purchase";
        const ticketIdentifier = `${category}-${interaction.user.id}`;

        const existingTicket = interaction.guild.channels.cache.find((channel) => channel.name === ticketIdentifier);

        if (existingTicket) {
            const here = hyperlink("here", existingTicket.url);
            return interaction.editReply({
                components: [
                    UIContainer.warn(`You have an existing ${category} ticket open. You can access it ${here}`),
                ],
                flags: [MessageFlags.IsComponentsV2],
            });
        }

        const ticketChannel = await interaction.guild.channels.create({
            name: ticketIdentifier,
            type: ChannelType.GuildText,
            parent: ChannelParentIds.PMTVTickets,
            permissionOverwrites: [
                {
                    id: interaction.guild.roles.everyone,
                    deny: ["ViewChannel"],
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"],
                },
            ],
        });

        const closeTicketButton = new ButtonBuilder()
            .setCustomId(ButtonCustomIds.PMTVTicketClose)
            .setLabel("Close ticket")
            .setStyle(ButtonStyle.Danger);

        const container = UIContainerBuilder.create()
            .addAccent(Colors.DarkBlue)
            .addHeading("PirateMedia PMTV Purchase Ticket", HeadingLevel.Three)
            .addText(
                "Thank you for creating a ticket. Someone will get back to you soon. In the meantime, please ensure the below details are accurate.",
            )
            .addLargeSeparator()
            .addText(bold("Preferred username"))
            .addText(username)
            .addText(bold("Preferred password"))
            .addText(password)
            .addText(bold("Plan duration"))
            .addText(duration)
            .addText(bold("Device connections"))
            .addText(connections)
            .addText(bold("Payment method"))
            .addText(paymentMethod)
            .addText(bold("Total cost"))
            .addText(
                `$${this.getTotalPurchaseCost(cast<PMTVPricingPlan>(duration), cast<PMTVConnectionCount>(connections))}`,
            )
            .addLargeSeparator()
            .addActionButtons(closeTicketButton)
            .build();

        const ticketInfoMessage = await ticketChannel.send({
            components: [container],
            flags: [MessageFlags.IsComponentsV2],
        });

        await ticketInfoMessage.pin();

        const here = hyperlink("here", ticketChannel.url);
        return interaction.editReply({
            components: [UIContainer.success(`Your ticket has been created. You can access it ${here}`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }

    private getTotalPurchaseCost(pricePlan: PMTVPricingPlan, connectionCount: PMTVConnectionCount): number {
        const plan = PMTV_PRICE_MAP[pricePlan];
        const cost = plan[connectionCount];

        return cost;
    }
}
