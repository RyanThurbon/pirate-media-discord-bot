import { ApplyOptions } from "@sapphire/decorators";
import type { ChatInputCommandDeniedPayload, UserError } from "@sapphire/framework";
import { Events, Listener } from "@sapphire/framework";
import { handleChatInputDenied } from "./_shared";

@ApplyOptions<Listener.Options>({
    event: Events.ChatInputCommandDenied,
})
export class ChatInputCommandDeniedListener extends Listener<typeof Events.ChatInputCommandDenied> {
    public async run(error: UserError, payload: ChatInputCommandDeniedPayload) {
        return handleChatInputDenied(error, payload);
    }
}
