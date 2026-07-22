import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, registerMainMenuItem } from "../toolkit/index.js";
import { generateNumbers, formatNumbers } from "../generate.js";

registerMainMenuItem({ label: "📊 0-1", data: "preset:0-1", order: 30 });

const composer = new Composer<Ctx>();

composer.callbackQuery("preset:0-1", async (ctx) => {
  await ctx.answerCallbackQuery();
  const nums = generateNumbers({ min: 0, max: 1, count: 1, isDecimal: true });
  await ctx.reply(`${formatNumbers(nums, true)}`, {
    reply_markup: inlineKeyboard([
      [inlineButton("🔄 Roll again", "preset:0-1"), inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

export default composer;
