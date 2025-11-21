'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation' // 페이지 이동 도구 추가

export default function Home() {
  const router = useRouter()
  const [isConnected, setIsConnected] = useState<boolean | null>(null)

  useEffect(() => {
    async function checkConnection() {
      const { data, error } = await supabase.from('study_sessions').select('*').limit(1)
      if (!error) setIsConnected(true)
      else setIsConnected(false)
    }
    checkConnection()
  }, [])

  // 방 만들기 함수
  const createRoom = () => {
    // 방 번호를 현재 시간으로 만듭니다 (예: 1732185...)
    // 이렇게 하면 겹치지 않는 고유한 방이 생깁니다.
    const roomId = Date.now().toString()
    router.push(`/room/${roomId}`)
  }

  return (
    <div className="min-h-screen bg-[#F0FAF8] flex flex-col items-center justify-center p-4 font-sans text-slate-700">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 text-center border-2 border-white">
        
        <div className="mb-6">
          <span className="bg-[#FF8FAB] text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider">
            임용 2차 합격기원 🙏
          </span>
          <h1 className="text-4xl font-extrabold mt-3 text-[#333] tracking-tight">
            Review<span className="text-[#FF8FAB]">Us</span>
          </h1>
          <p className="text-gray-400 text-sm mt-2">우리들의 꼼꼼한 스터디 피드백</p>
        </div>

        {/* 버튼에 진짜 기능 연결! */}
        <button 
          className="w-full bg-[#3ACDC8] hover:bg-[#2ebdb8] text-white text-lg font-bold py-4 rounded-2xl transition-all transform active:scale-95 shadow-md mb-4"
          onClick={createRoom}
        >
          오늘의 스터디 시작하기 ✨
        </button>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">서버 연결 상태</p>
          {isConnected === null ? (
            <span className="text-gray-400 text-xs">연결 확인 중... 🔄</span>
          ) : isConnected ? (
            <span className="text-green-500 text-xs font-bold bg-green-100 px-2 py-1 rounded-md">
              ✅ 데이터베이스 연결 성공!
            </span>
          ) : (
            <span className="text-red-500 text-xs font-bold bg-red-100 px-2 py-1 rounded-md">
              ❌ 연결 실패 (설정을 확인해주세요)
            </span>
          )}
        </div>

      </div>
      <p className="mt-8 text-gray-400 text-xs">
        Designed for Teachers · 2025
      </p>
    </div>
  )
}