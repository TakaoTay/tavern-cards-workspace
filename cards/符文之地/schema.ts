export const Schema = z.object({
  世界状态: z
    .object({
      当前任务: z.string().prefault('无'),
      纪元时间: z.string().prefault('待定'),
      大地点: z.string().prefault('待定'),
      具体地点: z.string().prefault('待定'),
      各方势力声望: z
        .record(z.string().describe('势力名'), z.enum(['仇恨', '冷淡', '中立', '友善', '尊敬', '崇拜']))
        .prefault({}),
      梦境: z
        .object({
          是否处于梦境叙事中: z.enum(['是', '否']).prefault('否'),
          核心参与者: z.string().prefault(''),
        })
        .prefault({}),
    })
    .prefault({}),

  主角: z
    .object({
      档案: z
        .object({
          姓名: z.string().prefault('待定'),
          性别: z.string().prefault('待定'),
          年龄: z.coerce.number().prefault(0),
          外貌: z.string().prefault(''),
          背景: z.string().prefault(''),
        })
        .prefault({}),
      基础能级: z
        .enum(['T5凡人级', 'T4精英级', 'T3英雄级', 'T2半神级', 'T1星神级', 'T0原初级'])
        .or(z.literal('待定'))
        .prefault('待定'),
      状态: z
        .object({
          伤势等级: z.string().prefault('无伤'),
          魔法能量透支状态: z.string().prefault('正常'),
        })
        .prefault({}),
      财富资产: z.record(z.string().describe('货币名'), z.coerce.number()).prefault({}),
      物品栏: z
        .record(
          z.string().describe('物品名'),
          z.object({
            描述: z.string().prefault(''),
            数量: z.coerce.number().prefault(1),
          }),
        )
        .transform(items => _.pickBy(items, item => item.数量 > 0))
        .prefault({}),
    })
    .prefault({}),

  近期NPC: z
    .record(
      z.string().describe('NPC姓名，与世界书「人物：X」条目中的X一致'),
      z
        .object({
          基础能级: z
            .enum(['T5凡人级', 'T4精英级', 'T3英雄级', 'T2半神级', 'T1星神级', 'T0原初级'])
            .or(z.literal('待定'))
            .prefault('待定'),
          好感度: z.coerce
            .number()
            .transform(value => _.clamp(Math.round(value), -100, 1000))
            .prefault(100),
          与主角关系: z.string().prefault(''),
          状态: z
            .object({
              伤势等级: z.string().prefault('无伤'),
              魔法能量透支状态: z.string().prefault('正常'),
            })
            .prefault({}),
          物品栏: z
            .record(
              z.string().describe('物品名'),
              z.object({
                描述: z.string().prefault(''),
                数量: z.coerce.number().prefault(1),
              }),
            )
            .transform(items => _.pickBy(items, item => item.数量 > 0))
            .prefault({}),
        })
        .transform(npc => ({
          ...npc,
          _关系阶段:
            npc.好感度 < 0
              ? '戒备'
              : npc.好感度 < 350
                ? '陌生'
                : npc.好感度 < 700
                  ? '熟悉'
                  : npc.好感度 < 900
                    ? '恋慕'
                    : '不渝',
        })),
    )
    .prefault({}),

  主线剧情: z
    .record(
      z.string().describe('主线名'),
      z.object({
        启用: z.enum(['是', '否']).prefault('否'),
        当前章节: z.string().prefault('未开始'),
        已完成章节: z.array(z.string()).prefault([]),
      }),
    )
    .prefault({}),

  女性状态: z
    .record(
      z.string().describe('角色姓名'),
      z.object({
        处女: z.string().prefault('待定'),
        年龄: z.coerce.number().prefault(0),
        身高: z.coerce.number().prefault(0),
        体重: z.coerce.number().prefault(0),
        三围: z.string().prefault('待定'),
        行为: z.string().prefault(''),
        内心话: z.string().prefault(''),
        口腔: z.string().prefault(''),
        乳房: z.string().prefault(''),
        小穴: z.string().prefault(''),
        菊花: z.string().prefault(''),
        玉足: z.string().prefault(''),
      }),
    )
    .prefault({}),

  结缘红颜: z
    .record(
      z.string().describe('角色姓名'),
      z.object({
        关系: z.string().prefault(''),
      }),
    )
    .prefault({}),
});

export type Schema = z.output<typeof Schema>;
