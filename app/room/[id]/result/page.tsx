'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function ResultPage() {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 데이터베이스에서 피드백 가져오기
  useEffect(() => {
    async function fetchFeedbacks() {
      // 최신순으로 정렬해서 가져옴
      const { data, error } = await supabase
        .from('feedbacks')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) console.error('에러 발생:', error)
      else setFeedbacks(data || [])
      
      setLoading(false)
    }
    fetchFeedbacks()
  }, [])

  if (loading) return <div className="p-10 text-center">로딩중... ⏳</div>

  return (
    <div className="min-h-screen bg-[#F0FAF8] p-4 font-sans text-slate-700 pb-20">
      
      {/* 상단 헤더 */}
      <div className="max-w-md mx-auto mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#333]">📊 피드백 결과 리포트</h1>
        <p className="text-sm text-gray-400 mt-1">우리 스터디원들의 따뜻한 조언</p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        
        {/* 요약 카드 (지금까지 받은 피드백 개수) */}
        <div className="bg-white p-6 rounded-3xl shadow-lg text-center border-2 border-white">
          <span className="text-4xl">📬</span>
          <h2 className="text-lg font-bold mt-2">총 <span className="text-[#FF8FAB]">{feedbacks.length}</span>개의 피드백</h2>
          <p className="text-xs text-gray-400">오늘도 고생 많으셨어요!</p>
        </div>

        {/* 피드백 리스트 */}
        <div className="space-y-4">
          {feedbacks.map((item, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm animate-fade-in">
              {/* 뱃지 (과목 표시) */}
              <div className="mb-3">
                {item.subject_type === 'interview' && <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-md font-bold">🎤 심층면접</span>}
                {item.subject_type === 'demo' && <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-md font-bold">🏫 수업실연</span>}
                {item.subject_type === 'english' && <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-md font-bold">🗽 영어실연</span>}
                <span className="text-xs text-gray-300 ml-2">{new Date(item.created_at).toLocaleTimeString()}</span>
              </div>

              {/* 점수 보여주기 */}
              <div className="flex gap-2 mb-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                {item.subject_type === 'interview' && (
                  <>
                    <div>😊 태도: <b>{item.interview_score_attitude}</b>점</div>
                    <div>🧠 논리: <b>{item.interview_score_logic}</b>점</div>
                  </>
                )}
                {item.subject_type === 'demo' && (
                  <>
                    <div>✅ 조건: <b>{item.demo_score_condition}</b>점</div>
                    <div>🗣 발문: <b>{item.demo_score_interaction}</b>점</div>
                  </>
                )}
                {item.subject_type === 'english' && (
                  <>
                    <div>🔑 Key: <b>{item.english_score_key_expr}</b>점</div>
                    <div>🇺🇸 유창성: <b>{item.english_score_fluency}</b>점</div>
                  </>
                )}
              </div>

              {/* 텍스트 피드백 (말풍선) */}
              <div className="bg-[#F0FAF8] p-3 rounded-xl rounded-tl-none text-sm text-gray-700 leading-relaxed">
                {item.subject_type === 'interview' && item.interview_detail}
                {item.subject_type === 'demo' && item.demo_good_point}
                {item.subject_type === 'english' && item.english_correction}
                {!item.interview_detail && !item.demo_good_point && !item.english_correction && <span className="text-gray-400">(코멘트 없음)</span>}
              </div>
            </div>
          ))}

          {feedbacks.length === 0 && (
             <div className="text-center text-gray-400 py-10">
               아직 도착한 피드백이 없어요. <br/>
               입력 화면에서 테스트를 해보세요!
             </div>
          )}
        </div>
      </div>
    </div>
  )
}