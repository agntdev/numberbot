import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, registerMainMenuItem } from "../toolkit/index.js";
import { generateNumbers, formatNumbers } from "../generate.js";

registerMainMenuItem({ label: "⚡ Inline", data: "numberbot:inline", order: 50 });

const composer = new Composer<Ctx>();

composer.callbackQuery("numberbot:inline", async (ctx) => {
  await ctx.answerCallbackQuery();
  const nums = generateNumbers({ min: 1, max: 10, count: 3 });
  await ctx.reply(formatNumbers(nums, false), {
    reply_markup: inlineKeyboard([
      [inlineButton("⚡ Roll again", "numberbot:inline"), inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
});

composer.on("inline_query", async (ctx) => {
  const query = ctx.inlineQuery.query.trim();
  const match = /^(\d+)-(\d+)\s+(\d+)$/.exec(query);
  if (!match) {
    await ctx.answerInlineQuery([]);
    return;
  }

  const min = Number(match[1]);
  const max = Number(match[2]);
  const count = Math.min(Number(match[3]), 20);

  if (min > max) {
    await ctx.answerInlineQuery([]);
    return;
  }

  const nums = generateNumbers({ min, max, count });
  const text = formatNumbers(nums, false);

  await ctx.answerInlineQuery([
    {
      type: "article",
      id: `rand_${Date.now()}`,
      title: `${count} numbers (${min}–${max})`,
      input_message_content: { message_text: text },
    },
  ]);
});

export default composer;
