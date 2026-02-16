'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Message } from '@/lib/types';
import HostSignature from '@/components/HostSignature';
import { CONTENT } from '@/lib/constants/content';

// 禁用静态生成，避免framer-motion构建错误
export const dynamic = 'force-dynamic';

export default function WallPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ nickname: '', content: '' });
  const [showForm, setShowForm] = useState(false);

  // 获取留言列表
  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nickname.trim() || !formData.content.trim()) {
      alert('请填写昵称和留言内容');
      return;
    }

    // 验证长度
    if (formData.nickname.trim().length > 20) {
      alert('昵称不能超过20个字符');
      return;
    }

    if (formData.content.trim().length > 200) {
      alert('留言内容不能超过200个字符');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname: formData.nickname.trim(),
          content: formData.content.trim(),
        }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([newMessage, ...messages]);
        setFormData({ nickname: '', content: '' });
        setShowForm(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || '提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('网络错误，请检查网络连接后重试');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-cream-50 via-cream-100 to-cream-50">
      <div className="container mx-auto px-5 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* 标题 */}
          <div className="text-center mb-12 md:mb-16">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-light text-deepRed-500 mb-5 tracking-tight"
            >
              祝福墙
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-chineseBlue-500 text-base md:text-lg font-light"
            >
              留下你的新年祝福，与大家分享温暖
            </motion.p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="h-px w-24 md:w-32 mx-auto mt-4 bg-gradient-to-r from-transparent via-chineseBlue-300 to-transparent"
            />
          </div>

          {/* 提交留言按钮 */}
          {!showForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-10 text-center"
            >
              <button
                onClick={() => setShowForm(true)}
                className="bg-deepRed-500 text-cream-50 px-8 py-3.5 rounded-xl hover:bg-deepRed-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg hover:shadow-deepRed-500/30 border border-deepRed-600/20"
              >
                留下祝福
              </button>
            </motion.div>
          )}

          {/* 留言表单 */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="bg-gradient-to-br from-cream-50 to-cream-100 border-2 border-deepRed-200 rounded-2xl p-6 md:p-8 mb-10 space-y-5 shadow-lg"
              >
                <div>
                  <label className="block text-charcoal-700 mb-2.5 font-medium text-sm">昵称</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full px-4 py-2.5 border border-deepRed-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepRed-500 focus:border-transparent bg-white transition-all font-light"
                    placeholder="你的名字"
                    maxLength={20}
                    required
                  />
                </div>
                <div>
                  <label className="block text-charcoal-700 mb-2.5 font-medium text-sm">留言</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2.5 border border-deepRed-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-deepRed-500 focus:border-transparent bg-white resize-none transition-all font-light leading-relaxed"
                    rows={5}
                    placeholder="写下你的新年祝福..."
                    maxLength={200}
                    required
                  />
                  <p className="text-xs text-charcoal-400 mt-2 text-right font-light">
                    {formData.content.length}/200
                  </p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-deepRed-500 text-cream-50 px-6 py-2.5 rounded-lg hover:bg-deepRed-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md hover:shadow-lg"
                  >
                    {submitting ? '提交中...' : '提交'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ nickname: '', content: '' });
                    }}
                    className="px-6 py-2.5 border-2 border-deepRed-200 text-deepRed-500 rounded-lg hover:bg-deepRed-50 transition-colors font-medium"
                  >
                    取消
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* 留言列表 */}
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="text-4xl mb-4 inline-block"
              >
                ⏳
              </motion.div>
              <p className="text-deepRed-500">加载中...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12 text-charcoal-500">
              <p className="text-xl mb-2">还没有留言</p>
              <p className="text-sm">成为第一个留下祝福的人吧！</p>
            </div>
          ) : (
            <div className="space-y-5 md:space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    className={`relative border-2 rounded-2xl p-6 md:p-8 shadow-md hover:shadow-lg transition-shadow duration-300 ${
                      message.isHost
                        ? 'border-gold-300 bg-gradient-to-br from-cream-50 via-gold-50/30 to-cream-50'
                        : 'border-deepRed-200 bg-gradient-to-br from-cream-50 to-cream-100'
                    }`}
                  >
                    {/* 发起人特殊装饰 */}
                    {message.isHost && (
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-200/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    )}
                    
                    <div className="relative flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-medium text-base md:text-lg ${
                            message.isHost ? 'text-gold-700' : 'text-deepRed-600'
                          }`}
                        >
                          {message.nickname}
                        </span>
                        {message.isHost && (
                          <span className="text-xs bg-gold-200 text-gold-800 px-2.5 py-1 rounded-full font-medium border border-gold-300">
                            发起人
                          </span>
                        )}
                      </div>
                      <span className="text-xs md:text-sm text-charcoal-400 font-light whitespace-nowrap">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="relative text-charcoal-700 leading-relaxed whitespace-pre-wrap font-light text-base md:text-lg">
                      {message.content}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* 返回首页 */}
          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-deepRed-500 hover:text-chineseBlue-500 transition-colors underline"
            >
              返回首页
            </button>
          </div>

          {/* 发起人签名 */}
          <div className="mt-16">
            <HostSignature />
          </div>
        </div>
      </div>
    </main>
  );
}
