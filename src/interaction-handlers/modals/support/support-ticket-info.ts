import { ButtonCustomIds, ChannelParentIds, ModalCustomIds, ModalInputCustomIds } from "@/lib/constants";
import { UIMessage } from "@/lib/ui/UIMessage";
import { createTicketChannel, type SupportTicketCategory } from "@/lib/utils/tickets";
import { ApplyOptions } from "@sapphire/decorators";
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { cast, isNullOrUndefined } from "@sapphire/utilities";
import type { ModalSubmitInteraction } from "discord.js";
import { hyperlink, MessageFlags } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class SupportTicketInfoModalSubmitHandler extends InteractionHandler {
    public override parse(interaction: ModalSubmitInteraction) {
        if (interaction.customId !== ModalCustomIds.support.info) {
            return this.none();
        }

        return this.some();
    }

    public async run(interaction: ModalSubmitInteraction<"cached">) {
        await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

        const fields = interaction.fields;

        const ids = {
            category: ModalInputCustomIds.support.category,
            issue: ModalInputCustomIds.support.issue,
            closeTicket: ButtonCustomIds.support.close,
        };

        const category = cast<SupportTicketCategory>(fields.getStringSelectValues(ids.category)[0]);
        const issue = fields.getTextInputValue(ids.issue);

        const ticketChannel = await createTicketChannel(interaction, {
            title: "Support Ticket",
            category,
            parentId: ChannelParentIds.SupportTickets,
            fields: {
                "Issue category": category,
                "Issue description": issue,
            },
            closeTicketBtnId: ids.closeTicket,
        });

        //handled by createTicketChannel()
        if (isNullOrUndefined(ticketChannel)) {
            return;
        }

        const here = hyperlink("here", ticketChannel.url);

        return interaction.editReply({
            components: [UIMessage.success(`Your ticket has been created. You can access it ${here}`)],
            flags: [MessageFlags.IsComponentsV2],
        });
    }
}
