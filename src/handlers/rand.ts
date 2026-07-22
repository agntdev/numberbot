import { Composer } from "grammy";
import type { Ctx } from "../bot.js";
import { inlineButton, inlineKeyboard, registerMainMenuItem } from "../toolkit/index.js";
import { generateNumbers, formatNumbers } from "../generate.js";

registerMainMenuItem({ label: "🎯 Custom", data: "rand:start", order: 40 });

const composer = new Composer<Ctx>();

composer.command("rand", async (ctx) => {
  ctx.session.step = "awaiting_min";
  await ctx.reply("What's the minimum number?", {
    reply_markup: { force_reply: true, input_field_placeholder: "e.g. 1" },
  });
});

composer.callbackQuery("rand:start", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.step = "awaiting_min";
  await ctx.reply("What's the minimum number?", {
    reply_markup: { force_reply: true, input_field_placeholder: "e.g. 1" },
  });
});

composer.on("message:text", async (ctx, next) => {
  const step = ctx.session.step;
  if (!step || step === "idle") return next();

  if (step === "awaiting_min") {
    const val = Number(ctx.message.text.trim());
    if (isNaN(val)) {
      await ctx.reply("That doesn't look like a number. Try again.");
      return;
    }
    ctx.session.min = val;
    ctx.session.step = "awaiting_max";
    await ctx.reply("And the maximum?", {
      reply_markup: { force_reply: true, input_field_placeholder: "e.g. 100" },
    });
    return;
  }

  if (step === "awaiting_max") {
    const val = Number(ctx.message.text.trim());
    if (isNaN(val)) {
      await ctx.reply("That doesn't look like a number. Try again.");
      return;
    }
    if (val < (ctx.session.min ?? 0)) {
      await ctx.reply("Max has to be at least as big as min. Try again.");
      return;
    }
    ctx.session.max = val;
    ctx.session.step = "awaiting_count";
    await ctx.reply("How many numbers? (1–20)", {
      reply_markup: { force_reply: true, input_field_placeholder: "e.g. 5" },
    });
    return;
  }

  if (step === "awaiting_count") {
    const val = Number(ctx.message.text.trim());
    if (isNaN(val) || val < 1 || val > 20) {
      await ctx.reply("Pick a number between 1 and 20.");
      return;
    }
    ctx.session.count = val;
    ctx.session.step = "awaiting_type";
    await ctx.reply("Integer or decimal?", {
      reply_markup: inlineKeyboard([
        [inlineButton("Integer", "rand:type:int"), inlineButton("Decimal", "rand:type:dec")],
      ]),
    });
    return;
  }

  return next();
});

composer.callbackQuery("rand:type:int", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.isDecimal = false;
  ctx.session.step = "awaiting_unique";
  await ctx.reply("Allow duplicates?", {
    reply_markup: inlineKeyboard([
      [inlineButton("Yes", "rand:unique:yes"), inlineButton("No", "rand:unique:no")],
    ]),
  });
});

composer.callbackQuery("rand:type:dec", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.isDecimal = true;
  ctx.session.step = "awaiting_unique";
  await ctx.reply("Allow duplicates?", {
    reply_markup: inlineKeyboard([
      [inlineButton("Yes", "rand:unique:yes"), inlineButton("No", "rand:unique:no")],
    ]),
  });
});

composer.callbackQuery("rand:unique:yes", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.isUnique = false;
  ctx.session.step = "idle";
  await generateAndReply(ctx);
});

composer.callbackQuery("rand:unique:no", async (ctx) => {
  await ctx.answerCallbackQuery();
  ctx.session.isUnique = true;
  ctx.session.step = "idle";
  await generateAndReply(ctx);
});

async function generateAndReply(ctx: Ctx) {
  const { min, max, count, isDecimal, isUnique } = ctx.session;
  if (min === undefined || max === undefined || count === undefined) {
    await ctx.reply("Something went wrong. Tap /rand to try again.");
    return;
  }
  const nums = generateNumbers({ min, max, count, isDecimal, isUnique });
  ctx.session.lastNumbers = nums;
  const text = formatNumbers(nums, isDecimal ?? false);
  await ctx.reply(text, {
    reply_markup: inlineKeyboard([
      [inlineButton("🎯 Roll again", "rand:start"), inlineButton("⬅️ Back to menu", "menu:main")],
    ]),
  });
}

export default composer;
