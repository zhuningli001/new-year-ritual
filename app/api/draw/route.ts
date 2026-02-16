import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { determineDrawResult } from '@/lib/utils/draw';
import { allocateRedPacket } from '@/lib/utils/redpacket';
import { CONTENT } from '@/lib/constants/content';

// 获取随机祝福语（MVP版本）
function getRandomBlessing(): string {
  const blessings = CONTENT.blessings;
  return blessings[Math.floor(Math.random() * blessings.length)];
}

// MVP模式：预生成30个红包金额（服务端无法访问localStorage，所以需要客户端处理）
// 这里返回一个随机金额，但客户端会使用 redpacket-pool.ts 中的逻辑
function getMVPRedPacketAmount(): number {
  // 生成一个符合规则的随机金额（0.01 - 3.88）
  // 实际分配由客户端 redpacket-pool.ts 处理
  const { maxAmount, minAmount } = CONTENT.redpacketPool;
  return Math.floor((Math.random() * (maxAmount - minAmount) + minAmount) * 100) / 100;
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    const { userIdentifier } = body;

    if (!userIdentifier || typeof userIdentifier !== 'string') {
      return NextResponse.json(
        { error: 'User identifier is required' },
        { status: 400 }
      );
    }

    // 如果Supabase未配置，返回模拟数据用于开发
    // 注意：MVP模式下，重复抽取检查主要在客户端完成（localStorage）
    // 红包分配也由客户端 redpacket-pool.ts 处理
    // 服务端只返回结果类型，客户端会从预生成的红包池中分配
    if (!supabase) {
      const resultType = determineDrawResult();
      if (resultType === 'redpacket') {
        // 返回红包类型，具体金额由客户端从红包池中分配
        return NextResponse.json({
          type: 'redpacket',
          amount: 0, // 客户端会替换为实际分配金额
        });
      } else {
        // 使用固定的blessing ID，确保相同用户看到相同祝福
        // 基于userIdentifier生成一个稳定的ID
        const blessingId = `blessing-${userIdentifier.slice(-8)}`;
        const blessingIndex = parseInt(userIdentifier.slice(-8), 36) % CONTENT.blessings.length;
        
        return NextResponse.json({
          type: 'blessing',
          blessing: {
            id: blessingId,
            type: 'text',
            content: CONTENT.blessings[blessingIndex],
          },
        });
      }
    }

    // 检查用户是否已抽取过（数据库模式）
    const { data: existingDraw } = await supabase
      .from('user_draws')
      .select('*')
      .eq('user_identifier', userIdentifier)
      .single();

    if (existingDraw) {
      // 返回已有结果
      if (existingDraw.result_type === 'redpacket') {
        return NextResponse.json({
          type: 'redpacket',
          amount: existingDraw.redpacket_amount,
        });
      } else {
        const { data: blessing } = await supabase
          .from('blessings')
          .select('*')
          .eq('id', existingDraw.blessing_id)
          .single();

        return NextResponse.json({
          type: 'blessing',
          blessing: blessing ? {
            ...blessing,
            imageUrl: blessing.image_url,
          } : null,
        });
      }
    }

    // 决定抽取结果
    const resultType = determineDrawResult();

    if (resultType === 'redpacket') {
      // 检查红包池状态
      const { data: pool } = await supabase
        .from('redpacket_pool')
        .select('*')
        .eq('is_active', true)
        .single();

      if (!pool || pool.remaining_amount <= 0) {
        // 红包池已空，返回祝福
        return await drawBlessing(userIdentifier);
      }

      // 检查是否已领取过红包
      const { data: existingWinner } = await supabase
        .from('redpacket_winners')
        .select('*')
        .eq('pool_id', pool.id)
        .eq('user_identifier', userIdentifier)
        .single();

      if (existingWinner) {
        return await drawBlessing(userIdentifier);
      }

      // 计算剩余获奖者数量
      const { count } = await supabase
        .from('redpacket_winners')
        .select('*', { count: 'exact', head: true })
        .eq('pool_id', pool.id);

      // 使用新的分配算法：考虑30个红包的限制和3.88元上限
      const { totalCount, maxAmount } = CONTENT.redpacketPool;
      const remainingWinners = Math.max(1, totalCount - (count || 0));
      const amount = allocateRedPacket(pool.remaining_amount, remainingWinners);
      
      // 确保金额不超过3.88元上限
      const finalAmount = Math.min(amount, maxAmount, pool.remaining_amount);

      // 更新红包池（使用事务）
      const { error: updateError } = await supabase
        .from('redpacket_pool')
        .update({
          remaining_amount: pool.remaining_amount - finalAmount,
          total_winners: pool.total_winners + 1,
        })
        .eq('id', pool.id);

      if (updateError) {
        console.error('Error updating pool:', updateError);
        return await drawBlessing(userIdentifier);
      }

      // 记录红包获得者
      const { error: winnerError } = await supabase
        .from('redpacket_winners')
        .insert({
          pool_id: pool.id,
          user_identifier: userIdentifier,
          amount: finalAmount,
        });

      if (winnerError) {
        console.error('Error inserting winner:', winnerError);
        // 回滚红包池更新
        await supabase
          .from('redpacket_pool')
          .update({
            remaining_amount: pool.remaining_amount,
            total_winners: pool.total_winners,
          })
          .eq('id', pool.id);
        return await drawBlessing(userIdentifier);
      }

      // 记录抽取
      await supabase.from('user_draws').insert({
        user_identifier: userIdentifier,
        result_type: 'redpacket',
        redpacket_amount: finalAmount,
      });

      return NextResponse.json({
        type: 'redpacket',
        amount: finalAmount,
      });
    } else {
      return await drawBlessing(userIdentifier);
    }
  } catch (error) {
    console.error('Error in draw API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { 
        error: '抽取失败，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

async function drawBlessing(userIdentifier: string) {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return NextResponse.json({
      type: 'blessing',
      blessing: {
        id: 'default',
        type: 'text',
        content: '新年快乐！愿你在2026年马年，马上有福，马到成功！',
      },
    });
  }

  // 随机选择一条祝福
  const { data: blessings, error } = await supabase
    .from('blessings')
    .select('*');

  if (error || !blessings || blessings.length === 0) {
    // 如果没有祝福库，返回默认祝福
    const defaultBlessing = {
      id: 'default',
      type: 'text' as const,
      content: '新年快乐！愿你在2026年马年，马上有福，马到成功！',
    };

    await supabase.from('user_draws').insert({
      user_identifier: userIdentifier,
      result_type: 'blessing',
      blessing_id: 'default',
    });

    return NextResponse.json({
      type: 'blessing',
      blessing: defaultBlessing,
    });
  }

  const randomBlessing = blessings[Math.floor(Math.random() * blessings.length)];

  // 记录抽取
  await supabase.from('user_draws').insert({
    user_identifier: userIdentifier,
    result_type: 'blessing',
    blessing_id: randomBlessing.id,
  });

  return NextResponse.json({
    type: 'blessing',
    blessing: {
      ...randomBlessing,
      imageUrl: randomBlessing.image_url,
    },
  });
}
