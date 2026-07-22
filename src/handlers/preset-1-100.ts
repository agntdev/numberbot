import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, registerMainMenuItem } from "../toolkit/index.js";
import { generateNumbers, formatNumbers } from "../generate.js";

registerMainMenuItem({ label: "🔢 1-100", data: "preset:1-100", order: 20 });

const composer = new Composer<Ctx>();

composer.callbackQuery("preset:1-100", async (ctx) => {
  await ctx.answerCallbackQuery();
  const nums = generateNumbers({ min: 1, max: 100, count: 1 });
  await ctx.reply(`${formatNumbers(nums, false)}`, {
    reply_markup: inlineKeyboard([
      [inlineButton("🔄 Roll again", "preset:1-100"), inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
