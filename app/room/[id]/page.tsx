'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient' // 우리가 만든 연결 도구 가져오기
import { useRouter } from 'next/navigation'

export default function RoomPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('interview') // 현재 탭
  const [isSubmitting, setIsSubmitting] = useState(false) // 전송 중인지 확인

  // 1. 점수 관리 (화면의 별점들)
  const [scores, setScores] = useState({ score1: 0, score2: 0 })

  // 2. 텍스트 관리 (화면의 입력창들)
  const [feedbackText, setFeedbackText] = useState('')

  // 3. 탭이 바뀔 때마다 점수/텍스트 초기화 (섞이지 않게)
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setScores({ score1: 0, score2: 0 })
    setFeedbackText('')
  }

  // 4. [피드백 보내기] 버튼을 눌렀을 때 실행되는 진짜 기능
  const handleSubmit = async () => {
    if (scores.score1 === 0 || scores.score2 === 0) {
      alert('점수를 모두 선택해주세요! 🥺')
      return
    }

    const confirmMsg = window.confirm('정말 피드백을 보낼까요?')
    if (!confirmMsg) return

    setIsSubmitting(true) // "보내는 중..." 표시 시작

    // 데이터베이스(Supabase)에 보낼 데이터 보따리 싸기
    const dataToSave: any = {
      subject_type: activeTab, // 과목 (심층면접/수업실연/영어)
      // session_id: params.id, // (나중에 실제 방 기능 완성되면 주석 해제)
    }

    // 탭에 따라 다른 항목으로 저장
    if (activeTab === 'interview') {
      dataToSave.interview_score_attitude = scores.score1
      dataToSave.interview_score_logic = scores.score2
      dataToSave.interview_detail = feedbackText
    } else if (activeTab === 'demo') {
      dataToSave.demo_score_condition = scores.score1
      dataToSave.demo_score_interaction = scores.score2
      dataToSave.demo_good_point = feedbackText
    } else if (activeTab === 'english') {
      dataToSave.english_score_key_expr = scores.score1
      dataToSave.english_score_fluency = scores.score2
      dataToSave.english_correction = feedbackText
    }

    // Supabase로 전송!
    const { error } = await supabase.from('feedbacks').insert([dataToSave])

    if (error) {
      console.error(error)
      alert('전송 실패! 😭 개발자에게 문의하세요.')
    } else {
      alert('피드백이 성공적으로 저장되었어요! 🎉')
      // 입력창 비우기
      setScores({ score1: 0, score2: 0 })
      setFeedbackText('')
    }
    
    setIsSubmitting(false) // "보내는 중" 끝
  }

  return (
    <div className="min-h-screen bg-[#F0FAF8] p-4 font-sans text-slate-700 pb-24">
      {/* 상단 헤더 */}
      <div className="max-w-md mx-auto mb-6 flex justify-between items-center">
        <div className="text-lg font-bold text-[#3ACDC8] cursor-pointer" onClick={() => router.push('/')}>
          ReviewUs
        </div>
        <div className="bg-white px-3 py-1 rounded-full text-xs shadow-sm text-gray-500">
          스터디 룸
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-white">
        
        {/* 탭 메뉴 */}
        <div className="flex bg-gray-100 p-1 m-2 rounded-2xl">
          {['interview', 'demo', 'english'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-white text-[#3ACDC8] shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'interview' && '심층면접'}
              {tab === 'demo' && '수업실연'}
              {tab === 'english' && '영어실연'}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-8">
          {/* === 심층면접 === */}
          {activeTab === 'interview' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800">🎤 심층면접 피드백</h2>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">태도 및 목소리</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setScores({...scores, score1: num})} className="text-2xl transition-transform hover:scale-110">
                      {scores.score1 >= num ? '⭐️' : '🌑'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">답변의 논리성</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setScores({...scores, score2: num})} className="text-2xl transition-transform hover:scale-110">
                      {scores.score2 >= num ? '⭐️' : '🌑'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">상세 피드백</label>
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#3ACDC8] outline-none h-32 resize-none"
                  placeholder="피드백을 입력해주세요..."
                />
              </div>
            </div>
          )}

          {/* === 수업실연 === */}
          {activeTab === 'demo' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800">🏫 수업실연 피드백</h2>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">조건 충족도</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setScores({...scores, score1: num})} className="text-2xl transition-transform hover:scale-110">
                      {scores.score1 >= num ? '❤️' : '🤍'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">발문 및 순회지도</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setScores({...scores, score2: num})} className="text-2xl transition-transform hover:scale-110">
                      {scores.score2 >= num ? '❤️' : '🤍'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">좋았던 점 (Keep)</label>
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#3ACDC8] outline-none h-24 resize-none"
                  placeholder="피드백을 입력해주세요..."
                />
              </div>
            </div>
          )}

          {/* === 영어실연 === */}
          {activeTab === 'english' && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="text-xl font-bold text-gray-800">🗽 영어수업 피드백</h2>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">Key Expressions</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setScores({...scores, score1: num})} className="text-2xl transition-transform hover:scale-110">
                      {scores.score1 >= num ? '🍪' : '⚫️'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">Fluency & Confidence</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button key={num} onClick={() => setScores({...scores, score2: num})} className="text-2xl transition-transform hover:scale-110">
                      {scores.score2 >= num ? '🍪' : '⚫️'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-600">Correction (교정)</label>
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full bg-gray-50 border-0 rounded-xl p-4 text-sm focus:ring-2 focus:ring-[#3ACDC8] outline-none h-24 resize-none"
                  placeholder="피드백을 입력해주세요..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <button 
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#FF8FAB] hover:bg-[#ff7a9e]'
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중... ⏳' : '피드백 보내기 ✈️'}
          </button>
        </div>
      </div>
    </div>
  )
}