import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, registerMainMenuItem } from "../toolkit/index.js";
import { generateNumbers, formatNumbers } from "../generate.js";

registerMainMenuItem({ label: "🎲 1-6", data: "preset:1-6", order: 10 });

const composer = new Composer<Ctx>();

composer.callbackQuery("preset:1-6", async (ctx) => {
  await ctx.answerCallbackQuery();
  const nums = generateNumbers({ min: 1, max: 6, count: 1 });
  await ctx.reply(`🎲 ${formatNumbers(nums, false)}`, {
    reply_markup: inlineKeyboard([
      [inlineButton("🎲 Roll again", "preset:1-6"), inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
