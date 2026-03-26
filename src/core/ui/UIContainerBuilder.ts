import {
    bold,
    ButtonBuilder,
    ContainerBuilder,
    heading,
    HeadingLevel,
    SeparatorSpacingSize,
    unorderedList,
} from "discord.js";

export class UIContainerBuilder {
    private constructor(private readonly container: ContainerBuilder) {}

    public static create() {
        return new UIContainerBuilder(new ContainerBuilder());
    }

    public addAccent(color: number): UIContainerBuilder {
        this.container.setAccentColor(color);
        return this;
    }

    public addText(content: string): UIContainerBuilder {
        this.container.addTextDisplayComponents((text) => text.setContent(content));
        return this;
    }

    public addHeading(text: string, level: HeadingLevel = HeadingLevel.One): UIContainerBuilder {
        switch (level) {
            case HeadingLevel.One:
                return this.addText(heading(text, HeadingLevel.One));
            case HeadingLevel.Two:
                return this.addText(heading(text, HeadingLevel.Two));
            case HeadingLevel.Three:
                return this.addText(heading(text, HeadingLevel.Three));
            default:
                return this.addText(heading(text, HeadingLevel.One));
        }
    }

    public addSectionList(text: string, items: string[]): UIContainerBuilder {
        this.addHeading(bold(text), HeadingLevel.Three);
        this.addText(unorderedList(items));
        return this;
    }

    public addSection(text: string, items: string[]): UIContainerBuilder {
        this.addHeading(bold(text), HeadingLevel.Three);
        for (const item of items) {
            this.addText(item);
        }
        return this;
    }

    public addLargeSeparator(showDivider = true): UIContainerBuilder {
        this.container.addSeparatorComponents((separator) =>
            separator.setSpacing(SeparatorSpacingSize.Large).setDivider(showDivider),
        );
        return this;
    }

    public addSmallSeparator(showDivider = true): UIContainerBuilder {
        this.container.addSeparatorComponents((separator) =>
            separator.setSpacing(SeparatorSpacingSize.Small).setDivider(showDivider),
        );
        return this;
    }

    public addActionButtons(...buttons: ButtonBuilder[]) {
        this.container.addActionRowComponents<ButtonBuilder>((row) => row.addComponents(buttons));
        return this;
    }

    public build(): ContainerBuilder {
        return this.container;
    }
}
