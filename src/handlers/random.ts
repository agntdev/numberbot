import { Composer } from "grammy";
import type { Ctx } from "../bot.js";

const composer = new Composer<Ctx>();

composer.command("random", async (ctx) => {
  ctx.session.step = "awaiting_min";
  await ctx.reply("What's the minimum number?", {
    reply_markup: { force_reply: true, input_field_placeholder: "e.g. 1" },
  });
});

export default composer;
