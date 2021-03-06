import SlashCommand from "../command/SlashCommand";
import {CommandInteraction} from "discord.js";
import Embed from "../../utils/Embed";
import fetch from 'node-fetch'

export default class InfoCommand extends SlashCommand {

    constructor() {
        super("info", "Zeigt infos über den Bot an")
    }

    async execute(interaction: CommandInteraction) {
        await interaction.deferReply()
        const url = `https://github.com/CoolePizza/PizzaBot`

        const embed = Embed.info(
            "PizzaBOT",
            `Ich bin Open Source! Kicke [hier](${url}) um den Source Code anzusehen.`,
            [],
            url
        )
        embed.setFooter(`CoolePizza/PizzaBot`)

        const repo: GithubRepo = await fetch(`https://api.github.com/repos/CoolePizza/PizzaBot`)
            .then(value => value.json())
        const contributors: Array<GithubContributor> = await fetch(`https://api.github.com/repos/CoolePizza/PizzaBot/contributors`)
            .then(value => value.json())

        embed.addField(
            "Github Stars ⭐",
            repo.stargazers_count.toString(),
            true
        )

        embed.addField(
            "Mitwirkende",
            contributors.map(value => `[${value.login}](${value.html_url})`)
                .join(", "),
            true
        )

        embed.setAuthor(repo.owner.login, repo.owner.avatar_url, repo.owner.html_url)

        interaction.editReply({
            embeds: [embed]
        })
    }
}

interface GithubContributor {
    login: string,
    html_url: string,
    avatar_url: string
}

interface GithubRepo {
    name: string,
    owner: GithubContributor,
    stargazers_count: number
}
