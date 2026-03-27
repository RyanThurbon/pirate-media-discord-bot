import {
    bold,
    ButtonBuilder,
    ContainerBuilder,
    heading,
    HeadingLevel,
    SeparatorSpacingSize,
    unorderedList,
    type APIContainerComponent,
} from "discord.js";

export class UIContainer {
    private readonly container: ContainerBuilder = new ContainerBuilder();

    public accent(color: number): UIContainer {
        this.container.setAccentColor(color);
        return this;
    }

    public title(title: string): UIContainer {
        this.container.addTextDisplayComponents((text) => text.setContent(heading(title, HeadingLevel.Two)));
        return this;
    }

    public text(content: string): UIContainer {
        this.container.addTextDisplayComponents((text) => text.setContent(content));
        return this;
    }

    public separator(size: SeparatorSpacingSize = SeparatorSpacingSize.Large, divider = true): UIContainer {
        this.container.addSeparatorComponents((separator) => separator.setSpacing(size).setDivider(divider));
        return this;
    }

    public field(label: string, value: string): UIContainer {
        this.text(`${bold(label)}\n${value}`);
        return this;
    }

    public fields(entries: Record<string, string>): UIContainer {
        for (const [label, value] of Object.entries(entries)) {
            this.field(label, value);
        }
        return this;
    }

    public sectionList(title: string, items: string[]): UIContainer {
        this.container.addTextDisplayComponents((text) => text.setContent(heading(title, HeadingLevel.Three)));
        this.text(unorderedList(items));
        return this;
    }

    public actions(...buttons: ButtonBuilder[]): UIContainer {
        this.container.addActionRowComponents<ButtonBuilder>((row) => row.addComponents(buttons));
        return this;
    }

    public build(): ContainerBuilder {
        return this.container;
    }

    public toJSON(): APIContainerComponent {
        return this.container.toJSON();
    }
}
