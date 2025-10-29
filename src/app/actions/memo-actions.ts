'use server'

import { createServerClient } from '@/utils/supabase/server'
import { Memo, MemoFormData } from '@/types/memo'
import { revalidatePath } from 'next/cache'

// 데이터베이스 행을 Memo 타입으로 변환
function dbRowToMemo(row: any): Memo {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 모든 메모 조회
export async function getMemos(params?: {
  category?: string
  searchQuery?: string
}): Promise<Memo[]> {
  const supabase = createServerClient()

  let query = supabase.from('memos').select('*').order('created_at', { ascending: false })

  // 카테고리 필터링
  if (params?.category && params.category !== 'all') {
    query = query.eq('category', params.category)
  }

  // 검색 필터링 (title, content, tags)
  if (params?.searchQuery && params.searchQuery.trim()) {
    const searchTerm = params.searchQuery.toLowerCase()
    query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error('메모 조회 실패:', error)
    throw new Error(`메모를 불러올 수 없습니다: ${error.message}`)
  }

  return (data || []).map(dbRowToMemo)
}

// 특정 메모 조회
export async function getMemoById(id: string): Promise<Memo | null> {
  const supabase = createServerClient()

  const { data, error } = await supabase.from('memos').select('*').eq('id', id).single()

  if (error) {
    console.error('메모 조회 실패:', error)
    return null
  }

  return data ? dbRowToMemo(data) : null
}

// 메모 생성
export async function createMemo(formData: MemoFormData): Promise<Memo> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .insert([
      {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('메모 생성 실패:', error)
    throw new Error(`메모를 생성할 수 없습니다: ${error.message}`)
  }

  revalidatePath('/')
  return dbRowToMemo(data)
}

// 메모 수정
export async function updateMemo(id: string, formData: MemoFormData): Promise<Memo> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('memos')
    .update({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('메모 수정 실패:', error)
    throw new Error(`메모를 수정할 수 없습니다: ${error.message}`)
  }

  revalidatePath('/')
  return dbRowToMemo(data)
}

// 메모 삭제
export async function deleteMemo(id: string): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from('memos').delete().eq('id', id)

  if (error) {
    console.error('메모 삭제 실패:', error)
    throw new Error(`메모를 삭제할 수 없습니다: ${error.message}`)
  }

  revalidatePath('/')
}

// 모든 메모 삭제
export async function clearAllMemos(): Promise<void> {
  const supabase = createServerClient()

  const { error } = await supabase.from('memos').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) {
    console.error('메모 전체 삭제 실패:', error)
    throw new Error(`메모를 삭제할 수 없습니다: ${error.message}`)
  }

  revalidatePath('/')
}

