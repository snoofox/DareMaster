import { Bot, InlineQueryResultBuilder, webhookCallback } from "grammy";
import { getTruth, getDare, getTruthAndDare } from "./scraper"
import express from "express";
import 'dotenv/config'

const bot = new Bot(process.env.BOT_TOKEN || '');

bot.command("start", (ctx: any) => {
    const intro = `Hello! I'm the DareMaster bot.
I'm here to help you and your friends play the Truth or Dare game.

<b>How to use:</b>
Just type <b>@daremasterbot</b> in any chat to receive a truth or dare question.

Developer: @shoto_dx`;

    ctx.reply(intro, {
        parse_mode: "HTML",
    })
});

bot.command("truth", async (ctx: any) => {
    const truth = await getTruth()
    ctx.reply(truth, {
        parse_mode: "HTML",
    })
});

bot.command("dare", async (ctx: any) => {
    const dare = await getDare()
    ctx.reply(dare, {
        parse_mode: "HTML",
    })
});

// Suggest commands in the menu
bot.api.setMyCommands([
    { command: "start", description: "Be greeted by the bot" },
    { command: "truth", description: "Get a truth question" },
    { command: "dare", description: "Get a dare question" },
]);

bot.on("inline_query", async (ctx) => {
    try {
        const [truth, dare] = await getTruthAndDare();

        const results = [
            InlineQueryResultBuilder
                .article("id:truth", "Truth")
                .text(
                    `<b>${truth}</b>`,
                    { parse_mode: "HTML" },
                ),
            InlineQueryResultBuilder
                .article("id:dare", "Dare")
                .text(
                    `<b>${dare}</b>`,
                    { parse_mode: "HTML" },
                )
        ]

        await ctx.answerInlineQuery(results, { cache_time: 0 });
    } catch (error) {
        console.error(error);
        await ctx.reply("An error occurred while processing your request.");
    }
});

if (process.env.NODE_ENV === "production") {
    const app = express();
    app.use(express.json());
    app.use(webhookCallback(bot, "express"));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Bot listening on port ${PORT}`);
    });
} else {
    bot.start();
}
