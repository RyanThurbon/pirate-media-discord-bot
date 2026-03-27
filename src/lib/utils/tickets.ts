import { UIColors, type PMTV_TICKET_CATEGORIES, type SUPPORT_TICKET_CATEGORIES } from "@/lib/constants";
import { UIContainer } from "@/lib/ui/UIContainer";
import { UIMessage } from "@/lib/ui/UIMessage";
import {
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    hyperlink,
    MessageFlags,
    type ModalSubmitInteraction,
    type Snowflake,
} from "discord.js";

export type SupportTicketCategory = (typeof SUPPORT_TICKET_CATEGORIES)[number];
export type PMTVTicketCategory = (typeof PMTV_TICKET_CATEGORIES)[number];

interface TicketChannelInfo {
    title: string;
    category: SupportTicketCategory | PMTVTicketCategory;
    fields: Record<string, string>;
    parentId: Snowflake;
    closeTicketBtnId: string;
}

export async function createTicketChannel(interaction: ModalSubmitInteraction<"cached">, info: TicketChannelInfo) {
    const category = info.category.toLowerCase();
    const identifier = `${category}-${interaction.user.id}`;

    const existingTicket = interaction.guild.channels.cache.find((c) => c.name === identifier);

    if (existingTicket) {
        const here = hyperlink("here", existingTicket.url);

        await interaction.editReply({
            components: [UIMessage.warning(`You have an existing ${category} ticket open. You can access it ${here}`)],
            flags: [MessageFlags.IsComponentsV2],
        });

        return null;
    }

    const ticketChannel = await interaction.guild.channels.create({
        name: identifier,
        type: ChannelType.GuildText,
        parent: info.parentId,
        permissionOverwrites: [
            { id: interaction.guild.roles.everyone, deny: ["ViewChannel"] },
            { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] },
        ],
    });

    const closeButton = new ButtonBuilder()
        .setCustomId(info.closeTicketBtnId)
        .setLabel("Close ticket")
        .setStyle(ButtonStyle.Danger);

    const panel = new UIContainer()
        .title(info.title)
        .text(
            "Thank you for creating a ticket. Someone will get back to you soon. In the meantime, please ensure the below details are accurate.",
        )
        .separator()
        .fields(info.fields)
        .separator()
        .actions(closeButton)
        .accent(UIColors.Info)
        .build();

    const ticketInfoMessage = await ticketChannel.send({
        components: [panel],
        flags: [MessageFlags.IsComponentsV2],
    });

    await ticketInfoMessage.pin();

    return ticketChannel;
}
