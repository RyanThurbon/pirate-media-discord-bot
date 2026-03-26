import { ButtonCustomIds, ChannelParentIds, ModalCustomIds, ModalInputCustomIds } from "@/core/constants";
import { UIContainer } from "@/core/ui/UIContainer";
import { UIContainerBuilder } from "@/core/ui/UIContainerBuilder";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes, UserError } from "@sapphire/framework";
import { cast, isNullOrUndefined } from "@sapphire/utilities";
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
export class SupportTicketInfoModalSubmitHandler extends InteractionHandler {
    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== ModalCustomIds.SupportTicketInfo) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const issue = interaction.fields.getTextInputValue(ModalInputCustomIds.SupportTicketInfoIssue);
        const category = cast<string>(
            interaction.fields.getStringSelectValues(ModalInputCustomIds.SupportTicketInfoCategory)[0],
        );

        const ticketIdentifier = `${category}-${interaction.user.id}`;

        if (isNullOrUndefined(interaction.guild)) {
            throw new UserError({
                identifier: "NoGuildContext",
                message: "This modal can only be submitted within a server.",
            });
        }

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
            parent: ChannelParentIds.SupportTickets,
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
            .setCustomId(ButtonCustomIds.SupportTicketClose)
            .setLabel("Close ticket")
            .setStyle(ButtonStyle.Danger);

        const container = UIContainerBuilder.create()
            .addAccent(Colors.DarkBlue)
            .addHeading("PirateMedia Support Ticket", HeadingLevel.Three)
            .addText(
                "Thank you for creating a ticket. Someone will get back to you soon. In the meantime, please ensure the below details are accurate.",
            )
            .addLargeSeparator()
            .addText(`${bold("Issue category")}\n${category}`)
            .addText(`${bold("Issue description")}\n${issue}`)
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
}
