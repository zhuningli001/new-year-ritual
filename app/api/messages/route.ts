import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Message } from '@/lib/types';

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

// GET: 获取留言列表
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    // 检查Supabase是否配置
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // 返回模拟数据
      return NextResponse.json([
        {
          id: 'mock-1',
          nickname: '宁莉',
          content: '感谢大家的参与！愿这份祝福伴随你度过美好的2026年。',
          isHost: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'mock-2',
          nickname: '小明',
          content: '新年快乐！祝大家马到成功！',
          isHost: false,
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
      ] as Message[]);
    }

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json(
        { error: '获取留言失败' },
        { status: 500 }
      );
    }

    const messages: Message[] = (data || []).map((msg) => ({
      id: msg.id,
      nickname: msg.nickname,
      content: msg.content,
      isHost: msg.is_host || false,
      createdAt: msg.created_at,
    }));

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    return NextResponse.json(
      { error: '服务器错误' },
      { status: 500 }
    );
  }
}

// POST: 提交新留言
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient();
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: '请求格式错误' },
        { status: 400 }
      );
    }

    const { nickname, content } = body;

    if (!nickname || !content) {
      return NextResponse.json(
        { error: '昵称和留言内容不能为空' },
        { status: 400 }
      );
    }

    // 验证内容长度
    if (nickname.trim().length > 20) {
      return NextResponse.json(
        { error: '昵称不能超过20个字符' },
        { status: 400 }
      );
    }

    if (content.trim().length > 200) {
      return NextResponse.json(
        { error: '留言内容不能超过200个字符' },
        { status: 400 }
      );
    }

    // 检查Supabase是否配置
    if (!supabase || !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      // 返回模拟数据
      return NextResponse.json({
        id: `mock-${Date.now()}`,
        nickname,
        content,
        isHost: false,
        createdAt: new Date().toISOString(),
      } as Message);
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          nickname: nickname.trim(),
          content: content.trim(),
          is_host: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json(
        { error: '提交留言失败' },
        { status: 500 }
      );
    }

    const message: Message = {
      id: data.id,
      nickname: data.nickname,
      content: data.content,
      isHost: data.is_host || false,
      createdAt: data.created_at,
    };

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { 
        error: '提交失败，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
