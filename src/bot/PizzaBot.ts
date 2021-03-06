import {Client, Intents} from "discord.js"
import CommandRegistry from "./command/CommandRegistry";
import ButtonRegistry from "./component/ButtonRegistry";
import TagCommand from "./commands/TagCommand";
import TagsCommand from "./commands/TagsCommand";
import TagTextCommand from "./commands/TagTextCommand";
import TagsTextCommand from "./commands/TagsTextCommand";
import GoogleCommand from "./commands/GoogleCommand";
import InfoCommand from "./commands/InfoCommand";
import MessageTextCommand from "./commands/MessageTextCommand";
import ColorCommand from "./commands/ColorCommand";
import PermissionsUtil from "../utils/PermissionsUtil";
import DatabaseHelper from "../utils/DatabaseHelper";

export default class PizzaBot {
    private readonly client: Client

    constructor() {
        this.client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS]});
        this.initListeners()
    }

    async connect() {
        await DatabaseHelper.connect();
        await this.client.login(process.env.DISCORD_TOKEN);
    }

    initListeners() {
        this.client.on("ready", () => {
            console.log(`Successfully logged in as Discord Bot ${this.client.user.tag}`)
            this.init();
        })

        this.client.on("messageCreate",  (message) => {
            const inviteRegex = new RegExp('(https?:\\/\\/)?(www\\.)?(((discordapp|discord)\\.com\\/invite)|(discord\\.gg))\\/(\\w+)', 'gm')
            if (inviteRegex.test(message.content) && !PermissionsUtil.isModerator(message.member)) {
                message.delete()
            }
        })
        this.client.on("rateLimit", (thing) => {
            console.log(thing)
        })
    }

    async init() {
        //Components
        new ButtonRegistry(this.client)

        //Commands
        const commandRegistry = new CommandRegistry(this.client)
        commandRegistry.addCommand(new TagCommand())
        commandRegistry.addCommand(new TagsCommand())
        commandRegistry.addCommand(new GoogleCommand())
        commandRegistry.addCommand(new InfoCommand())
        commandRegistry.addCommand(new ColorCommand())
        commandRegistry.addTextCommand(new TagTextCommand())
        commandRegistry.addTextCommand(new TagsTextCommand())
        commandRegistry.addTextCommand(new MessageTextCommand())
    }
}