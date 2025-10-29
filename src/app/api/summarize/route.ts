import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GEMINI_API_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    // 요청 본문 파싱
    const body = await request.json()
    const { title, content } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: '메모 내용이 비어있습니다.' },
        { status: 400 }
      )
    }

    // Google GenAI 클라이언트 초기화
    const ai = new GoogleGenAI({ apiKey })

    // 프롬프트 구성
    const prompt = `다음 메모를 간결하게 요약해주세요. 핵심 내용과 주요 포인트를 3-5문장으로 정리해주세요.

제목: ${title}

내용:
${content}

요약:`

    // Gemini API 호출
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-001',
      contents: prompt,
      config: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    })

    // 응답 텍스트 추출
    const summary = response.text

    if (!summary) {
      return NextResponse.json(
        { error: '요약을 생성할 수 없습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      summary: summary.trim(),
      success: true,
    })
  } catch (error: unknown) {
    console.error('Gemini API 호출 오류:', error)
    
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    
    return NextResponse.json(
      { error: `요약 생성 중 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    )
  }
}

