import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener, type ChatInputCommandErrorPayload } from "@sapphire/framework";
import { handleChatInputError } from "./_shared";

@ApplyOptions<Listener.Options>({
    event: Events.ChatInputCommandError,
})
export class ChatInputCommandErrorListener extends Listener<typeof Events.ChatInputCommandError> {
    public async run(error: unknown, payload: ChatInputCommandErrorPayload) {
        return handleChatInputError(error, payload);
    }
}
